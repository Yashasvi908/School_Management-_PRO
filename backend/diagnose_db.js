const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./src/models/Student');
const User = require('./src/models/User');
const Class = require('./src/models/Class');

dotenv.config();

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Database Diagnosis ---');
        
        const students = await Student.find({}).limit(5).populate('user', 'name');
        console.log('\nSample Students in DB:');
        students.forEach(s => {
            console.log(`- ID: ${s.studentId}, Name: ${s.user?.name || s.name}, ClassID: ${s.classId}, ClassField: ${s.class}, School: ${s.schoolId}`);
        });

        const classes = await Class.find({}).limit(5);
        console.log('\nSample Classes in DB:');
        classes.forEach(c => {
            console.log(`- ID: ${c._id}, Name: ${c.name}, School: ${c.schoolId}`);
        });

        const count = await Student.countDocuments({});
        console.log(`\nTotal Students: ${count}`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

diagnose();
