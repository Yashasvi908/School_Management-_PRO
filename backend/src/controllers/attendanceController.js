const StudentAttendance = require('../models/StudentAttendance');
const TeacherAttendance = require('../models/TeacherAttendance');
const StaffAttendance = require('../models/StaffAttendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Staff = require('../models/Staff');
const NotificationService = require('../utils/notificationService');
const mongoose = require('mongoose');

exports.markAttendance = async (req, res) => {
    try {
        const { date, records, type } = req.body;
        const schoolId = req.user.schoolId;
        const attendanceDate = new Date(new Date(date).setHours(0,0,0,0));

        let Model;
        if (type === 'student') Model = StudentAttendance;
        else if (type === 'teacher') Model = TeacherAttendance;
        else if (type === 'staff') Model = StaffAttendance;

        const operations = records.map(record => {
            const filter = { date: attendanceDate, schoolId };
            if (type === 'student') filter.studentId = record.studentId;
            else if (type === 'teacher') filter.teacherId = record.studentId;
            else if (type === 'staff') filter.staffId = record.studentId;

            const update = { 
                status: record.status, 
                remark: record.remark,
                checkIn: record.checkIn,
                checkOut: record.checkOut,
                shift: record.shift,
                overtime: record.overtime,
                schoolId
            };
            if (type === 'student') update.classId = req.body.classId;

            return {
                updateOne: {
                    filter,
                    update: { $set: update },
                    upsert: true
                }
            };
        });

        await Model.bulkWrite(operations);

        // --- Post-Attendance Logic & Alerts ---
        const month = attendanceDate.getMonth() + 1;
        const year = attendanceDate.getFullYear();
        const StudentSummary = require('../models/StudentAttendanceSummary');
        const TeacherSummary = require('../models/TeacherAttendanceSummary');
        const DeductionModel = require('../models/SalaryDeductionFlag');

        for (const record of records) {
            if (type === 'student') {
                const statusKey = record.status.toLowerCase();
                await StudentSummary.findOneAndUpdate(
                    { studentId: record.studentId, month, year, schoolId },
                    { $inc: { [statusKey]: 1, total: 1 } },
                    { upsert: true, new: true }
                ).then(async (summary) => {
                    const perc = (summary.present / summary.total) * 100;
                    await StudentSummary.findByIdAndUpdate(summary._id, { percentage: Math.round(perc) });
                });

                if (record.status === 'absent') {
                    const student = await Student.findById(record.studentId).populate('user');
                    if (student) {
                        NotificationService.sendAbsentAlert({ type: 'SMS', recipient: student.phone, studentName: student.user?.name || student.name, schoolId });
                    }
                }
            } else if (type === 'teacher') {
                // Update Teacher Summary
                const statusKey = record.status.toLowerCase();
                const cleanKey = statusKey === 'half-day' ? 'halfDay' : statusKey;
                await TeacherSummary.findOneAndUpdate(
                    { teacherId: record.studentId, month, year, schoolId },
                    { $inc: { [cleanKey]: 1, total: 1 } },
                    { upsert: true, new: true }
                ).then(async (summary) => {
                    const perc = (summary.present / summary.total) * 100;
                    await TeacherSummary.findByIdAndUpdate(summary._id, { percentage: Math.round(perc) });
                });

                // Flag for Salary Deduction
                if (record.status === 'absent' || record.status === 'half-day') {
                    await DeductionModel.findOneAndUpdate(
                        { teacherId: record.studentId, date: attendanceDate, schoolId },
                        { 
                            month, year,
                            reason: record.status,
                            deductDays: record.status === 'absent' ? 1.0 : 0.5
                        },
                        { upsert: true }
                    );
                    
                    if (record.status === 'absent') {
                        const teacher = await Teacher.findById(record.studentId).populate('user');
                        if (teacher) {
                            NotificationService.sendTeacherAbsentAlert({ teacherName: teacher.user?.name || teacher.name, schoolId });
                        }
                    }
                }
            }
        }

        res.json({ success: true, message: `${type.toUpperCase()} attendance processed` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTeacherAttendanceReport = async (req, res) => {
    try {
        const { teacherId, month, year } = req.query;
        const schoolId = req.user.schoolId;
        const SummaryModel = require('../models/TeacherAttendanceSummary');
        const DeductionModel = require('../models/SalaryDeductionFlag');
        const LeaveBalance = require('../models/LeaveBalance');
        const Teacher = require('../models/Teacher');

        if (teacherId) {
            const summary = await SummaryModel.findOne({ teacherId, month: Number(month), year: Number(year), schoolId });
            const deductions = await DeductionModel.find({ teacherId, month: Number(month), year: Number(year), schoolId });
            const leaveBalance = await LeaveBalance.findOne({ employee: teacherId, schoolId });
            const teacher = await Teacher.findById(teacherId).select('name employeeId designation baseSalary basicSalary');

            const totalWorkingDays = 26; // Should ideally be calculated from settings
            const basicSalary = teacher?.basicSalary || teacher?.baseSalary || 20000;
            const perDayRate = Math.round(basicSalary / totalWorkingDays);
            const totalDeductDays = deductions.reduce((s, d) => s + d.deductDays, 0);
            const totalDeduction = Math.round(perDayRate * totalDeductDays);

            return res.json({
                success: true,
                data: {
                    teacher: { name: teacher?.name, employeeId: teacher?.employeeId, designation: teacher?.designation },
                    period: { month, year, totalWorkingDays },
                    summary: {
                        present: summary?.present || 0,
                        absent: summary?.absent || 0,
                        late: summary?.late || 0,
                        halfDay: summary?.halfDay || 0,
                        leave: summary?.leave || 0,
                        percentage: summary?.percentage || 0
                    },
                    salaryImpact: {
                        perDayRate,
                        deductDays: totalDeductDays,
                        totalDeduction,
                        netSalary: basicSalary - totalDeduction
                    },
                    leaveBalance: {
                        cl: leaveBalance?.cl || 12,
                        sl: leaveBalance?.sl || 10,
                        el: leaveBalance?.el || 15
                    }
                }
            });
        }

        // All teachers summary
        const allSummaries = await SummaryModel.find({ month: Number(month), year: Number(year), schoolId })
            .populate('teacherId', 'name employeeId designation')
            .sort({ percentage: 1 });

        res.json({ success: true, data: allSummaries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentAttendanceReport = async (req, res) => {
    try {
        const { type, studentId, classId, sectionId, month, year, fromDate, toDate } = req.query;
        const schoolId = req.user.schoolId;
        const SummaryModel = require('../models/StudentAttendanceSummary');

        if (type === 'student') {
            const summary = await SummaryModel.findOne({ studentId, month: Number(month), year: Number(year), schoolId })
                .populate('studentId', 'name studentId class section');
            
            const records = await StudentAttendance.find({
                studentId,
                date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
                schoolId
            });

            const calendar = records.map(r => ({
                date: r.date,
                status: r.status // Status is directly on the doc now due to separate models
            }));

            res.json({
                success: true,
                data: {
                    student: summary?.studentId,
                    period: { month, year },
                    summary: {
                        present: summary?.present || 0,
                        absent: summary?.absent || 0,
                        late: summary?.late || 0,
                        leave: summary?.leave || 0,
                        total: summary?.total || 0,
                        percentage: summary?.percentage || 0,
                        isBelowThreshold: (summary?.percentage || 0) < 75
                    },
                    calendar
                }
            });
        } else if (type === 'class') {
            const summaries = await SummaryModel.find({ classId, month: Number(month), year: Number(year), schoolId })
                .populate('studentId', 'name studentId')
                .sort({ percentage: 1 });

            res.json({ success: true, data: summaries });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAttendanceReport = async (req, res) => {
    try {
        const { studentId, startDate, endDate, type = 'student' } = req.query;
        const schoolId = req.user.schoolId;

        let Model;
        if (type === 'student') Model = StudentAttendance;
        else if (type === 'teacher') Model = TeacherAttendance;
        else if (type === 'staff') Model = StaffAttendance;

        const query = { schoolId };
        if (studentId) {
            if (type === 'student') query.studentId = studentId;
            else if (type === 'teacher') query.teacherId = studentId;
            else if (type === 'staff') query.staffId = studentId;
        }

        const stats = await Model.aggregate([
            { $match: query },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({ success: true, data: { stats } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDailyAttendance = async (req, res) => {
    try {
        const { date, type = 'student', class: classId, section } = req.query;
        const schoolId = req.user.schoolId;
        const attendanceDate = new Date(new Date(date).setHours(0,0,0,0));

        let Model;
        if (type === 'student') Model = StudentAttendance;
        else if (type === 'teacher') Model = TeacherAttendance;
        else if (type === 'staff') Model = StaffAttendance;

        const attendance = await Model.find({ date: attendanceDate, schoolId });

        if (type === 'student') {
            const Student = require('../models/Student');
            const studentQuery = { classId, schoolId, isDeleted: false };
            if (section) studentQuery.section = section;
            
            const students = await Student.find(studentQuery).select('name rollNumber studentId');
            
            const existingMap = {};
            attendance.forEach(a => { existingMap[a.studentId.toString()] = a; });

            const merged = students.map(s => ({
                _id: s._id,
                name: s.name,
                studentId: s.rollNumber || s.studentId,
                status: existingMap[s._id.toString()]?.status || 'Present',
                remark: existingMap[s._id.toString()]?.remark || ''
            }));
            return res.json({ success: true, data: merged });
        }

        res.json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markTeacherAttendance = async (req, res) => {
    try {
        const { date, records } = req.body;
        const schoolId = req.user.schoolId;
        const today = new Date().toISOString().split('T')[0];
        const attendanceDate = new Date(new Date(date).setHours(0,0,0,0));

        // 1. VALIDATION
        if (attendanceDate > new Date() || (new Date() - attendanceDate) / (1000 * 60 * 60 * 24) > 3) {
            return res.status(400).json({ success: false, message: 'Invalid Date: Future or history > 3 days not allowed' });
        }

        const validStatuses = ['P', 'A', 'L', 'HD', 'WFH'];
        const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/; // HH:mm

        const TeacherModel = require('../models/Teacher');
        const AttendanceModel = require('../models/TeacherAttendance');
        const SummaryModel = require('../models/TeacherAttendanceSummary');
        const TimetableModel = require('../models/Timetable');
        const SubstAlertModel = require('../models/SubstituteAlert');
        const DeductionModel = require('../models/SalaryDeductionFlag');

        let summaryRes = { present: 0, absent: 0, late: 0, halfDay: 0, wfh: 0 };
        let subsNeeded = 0;

        for (const record of records) {
            if (!validStatuses.includes(record.status)) continue;
            if (record.checkIn && !timeRegex.test(record.checkIn)) continue;

            const finalStatus = record.status === 'P' ? 'present' : 
                          record.status === 'A' ? 'absent' : 
                          record.status === 'L' ? 'late' : 
                          record.status === 'HD' ? 'half-day' : 'wfh';

            // 2. UPSERT
            await AttendanceModel.findOneAndUpdate(
                { teacherId: record.teacherId, date: attendanceDate, schoolId },
                {
                    $set: {
                        status: finalStatus,
                        checkIn: record.checkIn,
                        checkOut: record.checkOut,
                        remark: record.remark,
                        markedBy: req.user.id,
                        markedAt: new Date()
                    }
                },
                { upsert: true }
            );

            // 3. SUBSTITUTE LOGIC
            if (record.status === 'A') {
                const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][attendanceDate.getDay()];
                const periods = await TimetableModel.find({ 'slots.teacherId': record.teacherId, day: dayName, schoolId });
                
                if (periods.length > 0) {
                    await SubstAlertModel.create({
                        absentTeacherId: record.teacherId,
                        affectedPeriods: periods,
                        date: attendanceDate,
                        status: 'PENDING',
                        schoolId
                    });
                    subsNeeded += periods.length;
                    
                    // Trigger Internal Notification (Mock)
                    console.log(`[Substitute Alert] ${record.teacherId} absent. ${periods.length} periods need assignment.`);
                }
            }

            // 4. SUMMARY UPDATE
            const month = attendanceDate.getMonth() + 1;
            const year = attendanceDate.getFullYear();
            const cleanKey = finalStatus === 'half-day' ? 'halfDay' : finalStatus;
            
            await SummaryModel.findOneAndUpdate(
                { teacherId: record.teacherId, month, year, schoolId },
                { $inc: { [cleanKey]: 1, total: 1 } },
                { upsert: true, new: true }
            ).then(async (sm) => {
                const p = (sm.present / sm.total) * 100;
                await SummaryModel.findByIdAndUpdate(sm._id, { percentage: Math.round(p) });
            });

            // 5. SALARY IMPACT
            if (record.status === 'A' || record.status === 'HD') {
                await DeductionModel.findOneAndUpdate(
                    { teacherId: record.teacherId, date: attendanceDate, schoolId },
                    { 
                        month, year,
                        reason: record.status === 'A' ? 'ABSENT' : 'HALF_DAY',
                        deductDays: record.status === 'A' ? 1.0 : 0.5
                    },
                    { upsert: true }
                );
            }

            // Update local summary response
            summaryRes[cleanKey]++;
        }

        res.status(201).json({
            success: true,
            message: `Attendance marked for ${records.length} teachers`,
            data: {
                summary: summaryRes,
                substituteAlerts: subsNeeded
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loadTeachersForAttendance = async (req, res) => {
    try {
        const { date = new Date().toISOString().split('T')[0], departmentId } = req.query;
        const schoolId = req.user.schoolId;
        const Holiday = require('../models/Holiday');
        const Teacher = require('../models/Teacher');
        const TeacherAttendance = require('../models/TeacherAttendance');

        // 1. Check holiday
        const holiday = await Holiday.findOne({ 
            schoolId, 
            date: new Date(new Date(date).setHours(0,0,0,0)) 
        });
        if (holiday) {
            return res.json({ success: true, isHoliday: true, holidayName: holiday.name });
        }

        // 2. Fetch all active teachers
        const query = { schoolId, status: 'ACTIVE' }; // Assuming field is status/isDeleted
        if (departmentId) query.departmentId = departmentId;

        const teachers = await Teacher.find(query)
            .populate('departmentId', 'name')
            .select('name employeeId photo departmentId designation')
            .sort({ name: 1 });

        // 3. Check if already marked today
        const existing = await TeacherAttendance.find({
            schoolId,
            date: new Date(new Date(date).setHours(0,0,0,0))
        });

        // Map existing for O(1) lookup
        const existingMap = {};
        existing.forEach(e => { existingMap[e.teacherId.toString()] = e; });

        // 4. Merge status
        const merged = teachers.map(t => ({
            teacherId: t._id,
            name: t.name,
            employeeId: t.employeeId || 'TCH-' + t._id.toString().slice(-4),
            photo: t.photo,
            department: t.departmentId?.name,
            designation: t.designation || 'Faculty',
            status: existingMap[t._id.toString()]?.status || 'present', // Default to 'present' per flow
            checkIn: existingMap[t._id.toString()]?.checkIn || null,
            checkOut: existingMap[t._id.toString()]?.checkOut || null,
            remark: existingMap[t._id.toString()]?.remark || ''
        }));

        res.json({
            success: true,
            data: {
                date,
                isAlreadyMarked: existing.length > 0,
                teachers: merged
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.exportStudentAttendance = async (req, res) => {
    try {
        const { format, classId, month, year } = req.query;
        const schoolId = req.user.schoolId;
        const SummaryModel = require('../models/StudentAttendanceSummary');
        const ExcelJS = require('exceljs');

        const data = await SummaryModel.find({ classId, month: Number(month), year: Number(year), schoolId })
            .populate('studentId', 'name rollNumber studentId')
            .sort({ 'studentId.rollNumber': 1 });

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Attendance');

            worksheet.columns = [
                { header: 'Roll No', key: 'roll', width: 10 },
                { header: 'Student Name', key: 'name', width: 25 },
                { header: 'Student ID', key: 'stdId', width: 15 },
                { header: 'Total Days', key: 'total', width: 12 },
                { header: 'Present', key: 'present', width: 10 },
                { header: 'Absent', key: 'absent', width: 10 },
                { header: 'Late', key: 'late', width: 10 },
                { header: 'Leave', key: 'leave', width: 10 },
                { header: 'Attendance %', key: 'percentage', width: 15 },
                { header: 'Status', key: 'status', width: 15 }
            ];

            data.forEach(d => {
                const perc = Math.round((d.present / d.total) * 100);
                const row = worksheet.addRow({
                    roll: d.studentId?.rollNumber || 'N/A',
                    name: d.studentId?.name || 'N/A',
                    stdId: d.studentId?.studentId || 'N/A',
                    total: d.total,
                    present: d.present,
                    absent: d.absent,
                    late: d.late,
                    leave: d.leave,
                    percentage: perc + '%',
                    status: perc >= 75 ? 'OK' : 'LOW ⚠️'
                });

                if (perc < 75) {
                    row.eachCell((cell) => {
                        cell.font = { color: { argb: 'FFFF0000' }, bold: true };
                    });
                }
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Attendance_Summary_${month}_${year}.xlsx`);
            return workbook.xlsx.write(res).then(() => res.status(200).end());
        }

        if (format === 'pdf') {
            res.status(200).json({ message: 'PDF Export Logic Initialized. Please ensure puppeteer is configured on server environment.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAttendanceStats = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const today = new Date(new Date().setHours(0,0,0,0));

        const studentPresent = await StudentAttendance.countDocuments({ date: today, schoolId, status: 'present' });
        const studentAbsent = await StudentAttendance.countDocuments({ date: today, schoolId, status: 'absent' });
        const teacherPresent = await TeacherAttendance.countDocuments({ date: today, schoolId, status: 'present' });
        const teacherAbsent = await TeacherAttendance.countDocuments({ date: today, schoolId, status: 'absent' });

        res.json({
            success: true,
            data: {
                students: { present: studentPresent, absent: studentAbsent },
                teachers: { present: teacherPresent, absent: teacherAbsent },
                date: today
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getHolidayCheck = async (req, res) => {
    try {
        const { date = new Date() } = req.query;
        const schoolId = req.user.schoolId;
        const Holiday = require('../models/Holiday');

        const holiday = await Holiday.findOne({ 
            schoolId, 
            date: new Date(new Date(date).setHours(0,0,0,0)) 
        });

        res.json({
            success: true,
            isHoliday: !!holiday,
            holiday: holiday || null
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
