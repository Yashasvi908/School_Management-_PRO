const User = require('../models/User');

/**
 * MOCK Notification Service
 * In a real production app, this would integrate with Twilio (SMS) and Nodemailer (Email)
 */

exports.sendAbsentAlert = async ({ type, recipient, studentName, days, schoolId }) => {
    console.log(`\x1b[36m%s\x1b[0m`, `[Notification System] Triggering ${type} alert for ${studentName}`);
    
    if (type === 'SMS') {
        console.log(`[SMS OUT] To: ${recipient} | MSG: Your child ${studentName} is ABSENT today. - School Management`);
    } else if (type === 'Email') {
        console.log(`[EMAIL OUT] To: ${recipient} | SUBJ: Consecutive Absence Alert | MSG: ${studentName} has been absent for ${days} days.`);
    }
};

exports.sendAdminCriticalAlert = async ({ msg, schoolId }) => {
    console.log(`\x1b[31m%s\x1b[0m`, `[CRITICAL ALERT] Admin notified: ${msg}`);
};

exports.sendTeacherAbsentAlert = async ({ teacherName, schoolId }) => {
    console.log(`\x1b[33m%s\x1b[0m`, `[FACULTY ALERT] ${teacherName} is absent. Prompting for substitute assignment.`);
};
