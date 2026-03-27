import React from 'react';
import { useSelector } from 'react-redux';
import StudentPanel from './StudentPanel';
import TeacherPanel from './TeacherPanel';
import ParentPanel from './ParentPanel';
import AccountantPanel from './AccountantPanel';
import LibrarianPanel from './LibrarianPanel';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth || {});
    const role = user?.role || 'admin';

    switch (role) {
        case 'student': return <StudentPanel />;
        case 'teacher': return <TeacherPanel />;
        case 'parent': return <ParentPanel />;
        case 'accountant': return <AccountantPanel />;
        case 'librarian': return <LibrarianPanel />;
        case 'admin':
        case 'superadmin':
        case 'principal':
            return <AdminPanel />;
        default:
            return <AdminPanel />;
    }
};

export default Dashboard;
