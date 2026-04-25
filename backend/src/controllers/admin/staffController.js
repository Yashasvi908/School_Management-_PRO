const Staff = require('../../models/Staff');
const User = require('../../models/User');
const Counter = require('../../models/Counter');

exports.registerStaff = async (req, res) => {
    try {
        const { name, role, contact, salary, email } = req.body;
        
        // Use provided email or generate a placeholder academic email
        const staffEmail = email || `${name.replace(/\\s+/g, '').toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}@school.edu`;

        const counter = await Counter.findOneAndUpdate({ id: 'staffId' }, { $inc: { seq: 1 } }, { returnDocument: 'after', upsert: true });
        const prefix = role.substring(0, 3).toUpperCase();
        const employeeId = `${prefix}-${counter.seq.toString().padStart(4, '0')}`;
        
        const tempPassword = Math.random().toString(36).slice(-8);

        const user = await User.create({
            name, email: staffEmail, password: tempPassword, role: 'staff', schoolId: req.user.schoolId
        });

        // Contact mapping is not strict in User schema, store contact in Staff model later if needed (our current Staff schema only has role, department, salary)
        // Wait, Staff schema: 
        // role, department, salary, joinDate, status
        // I will map contact to something if possible, or just ignore for now if missing. Let's send what we can. 

        const parsedSalary = salary ? parseInt(salary.replace(/\\D/g, '')) || 0 : 0;

        const staff = await Staff.create({
            user: user._id, 
            employeeId,
            role, 
            salary: parsedSalary, 
            schoolId: req.user.schoolId
        });

        res.status(201).json({ success: true, data: { employeeId, password: tempPassword, name, email: staffEmail } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStaff = async (req, res) => {
    try {
        const staffMembers = await Staff.find({ schoolId: req.user.schoolId }).populate('user', 'name email');
        res.json({ success: true, data: staffMembers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, contact, salary } = req.body;
        const staff = await Staff.findById(id).populate('user');
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }
        
        if (name && staff.user) {
            staff.user.name = name;
            await staff.user.save();
        }

        if (role) staff.role = role;
        if (salary) {
             staff.salary = parseInt(String(salary).replace(/\\D/g, '')) || 0;
        }

        await staff.save();
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
        
        await User.findByIdAndDelete(staff.user);
        await Staff.findByIdAndDelete(id);
        
        res.json({ success: true, message: 'Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
