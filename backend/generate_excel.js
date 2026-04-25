const ExcelJS = require('exceljs');
const path = require('path');

const generateMockExcel = async () => {
    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Students');

        // Headers (Matching what the importer expects)
        const headers = [
            'Full Name*', 'Academic Email*', 'Class*', 'Section*', 'Roll Number', 
            'Gender*', 'Date of Birth*', 'Guardian Name*', 'Guardian Phone*', 
            'Guardian Email', 'Address', 'Blood Group'
        ];
        sheet.addRow(headers);

        // Styling the Header Row
        sheet.getRow(1).font = { bold: true };

        // 10 Mock Students Data (with fully fresh emails to avoid duplication)
        const mockStudents = [
            ['Arjun Kapoor', 'arjun.k_26@school.edu', 'Class 10', 'A', '10A001', 'MALE', '12/04/2010', 'Ramesh Kapoor', '9876543210', '', 'Delhi', 'B+'],
            ['Aarohi Sharma', 'aarohi.s_26@school.edu', 'Class 10', 'B', '10B001', 'FEMALE', '05/08/2010', 'Rajesh Sharma', '9876543211', '', 'Mumbai', 'O+'],
            ['Vivaan Patel', 'vivaan.p_26@school.edu', 'Class 10', 'A', '10A002', 'MALE', '22/01/2010', 'Rahul Patel', '9876543212', '', 'Pune', 'A-'],
            ['Diya Reddy', 'diya.r_26@school.edu', 'Class 9', 'C', '09C001', 'FEMALE', '15/11/2011', 'Suresh Reddy', '9876543213', '', 'Hyderabad', 'AB+'],
            ['Kabir Verma', 'kabir.v_26@school.edu', 'Class 8', 'B', '08B001', 'MALE', '09/06/2012', 'Prakash Verma', '9876543214', '', 'Bangalore', 'O-'],
            ['Saanvi Gupta', 'saanvi.g_26@school.edu', 'Class 10', 'C', '10C001', 'FEMALE', '10/02/2010', 'Kishore Gupta', '9876543215', '', 'Noida', 'A+'],
            ['Reyansh Jain', 'reyansh.j_26@school.edu', 'Class 9', 'A', '09A001', 'MALE', '19/08/2011', 'Sunil Jain', '9876543216', '', 'Jaipur', 'B-'],
            ['Aanya Iyer', 'aanya.i_26@school.edu', 'Class 8', 'A', '08A001', 'FEMALE', '25/12/2012', 'Manoj Iyer', '9876543217', '', 'Chennai', 'AB-'],
            ['Vihaan Singh', 'vihaan.s_26@school.edu', 'Class 7', 'B', '07B001', 'MALE', '30/05/2013', 'Arun Singh', '9876543218', '', 'Lucknow', 'O+'],
            ['Myra Das', 'myra.d_26@school.edu', 'Class 7', 'A', '07A001', 'FEMALE', '04/09/2013', 'Amit Das', '9876543219', '', 'Kolkata', 'B+']
        ];

        mockStudents.forEach(student => sheet.addRow(student));

        // Auto-width columns for better visibility
        sheet.columns.forEach(column => { column.width = 20; });

        // Generate the Excel File
        const filePath = path.join(__dirname, 'NEW_STUDENT_DATA.xlsx');
        await workbook.xlsx.write(filePath);
        
        console.log(`\n======================================`);
        console.log(`✅ Excel file generated successfully!`);
        console.log(`Path: ${filePath}`);
        console.log(`======================================\n`);
        console.log(`You can now upload 'NEW_STUDENT_DATA.xlsx' directly into your Admin Panel.`);
    } catch (error) {
        console.error("Failed to generate Excel file:", error);
    }
};

generateMockExcel();
