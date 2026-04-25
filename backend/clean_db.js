const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const cleanDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./src/models/User');
        const Student = require('./src/models/Student');

        // Find all student users
        const studentUsers = await User.find({ role: 'student' });
        let orphanedCount = 0;

        for (const user of studentUsers) {
            const studentExists = await Student.findOne({ user: user._id });
            if (!studentExists) {
                await User.deleteOne({ _id: user._id });
                orphanedCount++;
            }
        }
        
        console.log(`Cleaned up ${orphanedCount} orphaned User records.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

cleanDb();
