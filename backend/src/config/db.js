const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\x1b[32m%s\x1b[0m`, `[Database] Status: Connected to MongoDB Cluster`);
    } catch (error) {
        console.error(`[Error] ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
