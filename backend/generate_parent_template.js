const ExcelJS = require('exceljs');
const path = require('path');

const generateParentTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Parent Registration');

    // Define columns
    worksheet.columns = [
        { header: 'Parent Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Assigned Student ID', key: 'studentId', width: 25 },
        { header: 'Occupation', key: 'occupation', width: 20 },
        { header: 'Address', key: 'address', width: 40 },
    ];

    // Add dummy data for guidance
    worksheet.addRow(['Rajesh Sharma', 'rajesh.sharma@email.com', '9876543210', 'STD20260001', 'Software Engineer', '123 Green Valley, Delhi']);
    worksheet.addRow(['Sunita Verma', 'sunita.verma@email.com', '9898765432', 'STD20260002', 'Teacher', '456 Rose Gardens, Mumbai']);

    // Style the header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6366F1' } // School Pro Indigo
    };

    const filePath = path.join(__dirname, 'Parent_Import_Template.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log('Template generated at:', filePath);
};

generateParentTemplate();
