const User = require('../models/User');

const runSeeder = async () => {
    try {
        const adminExists = await User.findOne({ email: 'superadmin@school.com' });
        
        if (!adminExists) {
            await User.create({
                name: 'Super Admin',
                email: 'superadmin@school.com',
                password: 'adminpassword123',
                role: 'admin',
                schoolId: 'SCH001'
            });
            console.log('[Seed] Super Admin initialized: superadmin@school.com');
        } else {
            console.log('[Seed] Super Admin already exists');
        }
    } catch (error) {
        console.error('[Seed] Initialization failed:', error.message);
    }
};

module.exports = runSeeder;
