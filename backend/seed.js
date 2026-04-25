const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'superadmin@school.com' });
        
        if (adminExists) {
            console.log('[Seed] SuperAdmin already exists.');
        } else {
            await User.create({
                name: 'Super Admin',
                email: 'superadmin@school.com',
                password: 'adminpassword123',
                role: 'superadmin',
                schoolId: 'SCH001'
            });
            console.log('[Seed] SuperAdmin created successfully!');
            console.log('Email: superadmin@school.com');
            console.log('Password: adminpassword123');
        }
        
    } catch (error) {
        console.error('[Error] Seeding failed:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();
