import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sidebarOpen: true,
    isLoading: false,
    theme: localStorage.getItem('theme') || 'light',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
    },
});

export const { toggleSidebar, setLoading, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
