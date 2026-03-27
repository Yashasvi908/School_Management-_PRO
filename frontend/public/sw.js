const CACHE_NAME = "school-app-v1";
const OFFLINE_URL = "/offline.html";

const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    // Add other static assets like CSS/JS bundles here dynamically or use Workbox in build step
    // For now caching app shell
];

// Install Event
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event (Offline Capabilities)
self.addEventListener("fetch", (event) => {
    // Cache First Strategy for assets, Network First for API
    const url = new URL(event.request.url);

    if (url.origin === location.origin && !url.pathname.startsWith('/api')) {
        // App Shell / Assets -> Cache First
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    } else {
        // API Requests -> Network First, fall back to cache
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Clone response to cache it
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Start offline fallback logic
                    return caches.match(event.request);
                })
        );
    }
});

// Push Notification Event
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};

    const title = data.title || "School Update";
    const options = {
        body: data.body || "You have a new notification.",
        icon: "/icon-192x192.png", // Ensure icons exist
        badge: "/badge-72x72.png",
        data: { url: data.url || "/" }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
