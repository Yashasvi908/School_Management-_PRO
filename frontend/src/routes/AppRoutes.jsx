import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Analytics from '../pages/Analytics';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../components/NotFound/NotFound';
import ProtectedRoute from './ProtectedRoute';
import StudentPanel from '../pages/StudentPanel';
import TeacherPanel from '../pages/TeacherPanel';
import ParentPanel from '../pages/ParentPanel';
import Attendance from '../pages/Attendance';
import Fees from '../pages/Fees';
import Chat from '../pages/Chat';
import Exams from '../pages/Exams';
import LectureUpload from '../pages/LectureUpload';
import Transport from '../pages/Transport';
import Library from '../pages/Library';
import TeacherPerformance from '../pages/TeacherPerformance';
import Layout from '../components/Layout';
import LiveClasses from '../pages/LiveClasses';

import SetupAccount from '../pages/SetupAccount';
import Settings from '../pages/Settings';

import { useSelector } from 'react-redux';

const AppRoutes = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth || {});
    const role = user?.role;
    const isAdmin = ['admin', 'superadmin', 'principal'].includes(role);

    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/setup-account" element={<SetupAccount />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={isAdmin ? <Dashboard /> : <StudentPanel tab="overview" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/student-dashboard" element={<StudentPanel />} />
                    
                    {/* Academic Routes */}
                    <Route path="/timetable" element={isAdmin ? <Dashboard /> : <StudentPanel tab="timetable" />} />
                    <Route path="/subjects" element={isAdmin ? <Dashboard /> : <StudentPanel tab="subjects" />} />
                    <Route path="/classes" element={<Dashboard />} />
                    <Route path="/sections" element={<Dashboard />} />
                    
                    {/* User Management */}
                    <Route path="/students" element={<Dashboard />} />
                    <Route path="/teachers" element={<Dashboard />} />
                    <Route path="/staff" element={<Dashboard />} />
                    <Route path="/parents" element={<Dashboard />} />
                    <Route path="/users" element={<Navigate to="/parents" replace />} />
                    
                    {/* Operations */}
                    <Route path="/attendance" element={isAdmin ? <Dashboard /> : <StudentPanel tab="attendance" />} />
                    <Route path="/fees" element={isAdmin ? <Dashboard /> : <StudentPanel tab="fees" />} />
                    <Route path="/library" element={isAdmin ? <Dashboard /> : <StudentPanel tab="library" />} />
                    <Route path="/transport" element={isAdmin ? <Dashboard /> : <StudentPanel tab="transport" />} />
                    
                    {/* Examination */}
                    <Route path="/exams" element={isAdmin ? <Dashboard /> : <StudentPanel tab="exams" />} />
                    <Route path="/results" element={isAdmin ? <Dashboard /> : <StudentPanel tab="results" />} />
                    
                    {/* Communication */}
                    <Route path="/notices" element={isAdmin ? <Dashboard /> : <StudentPanel tab="notices" />} />
                    <Route path="/events" element={isAdmin ? <Dashboard /> : <StudentPanel tab="events" />} />
                    <Route path="/chat" element={isAdmin ? <Dashboard /> : <StudentPanel tab="chat" />} />
                    
                    {/* System */}
                    <Route path="/analytics" element={isAdmin ? <Dashboard /> : <StudentPanel tab="analytics" />} />
                    <Route path="/security" element={<Dashboard />} />
                    <Route path="/backup" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Student/Teacher Specific Pages */}
                    {!isAdmin && (
                        <>
                            <Route path="/live-classes" element={<LiveClasses />} />
                            <Route path="/lecture-upload" element={<LectureUpload />} />
                            <Route path="/assignments" element={<StudentPanel tab="assignments" />} />
                            <Route path="/study-materials" element={<StudentPanel tab="study-materials" />} />
                            <Route path="/id-card" element={<StudentPanel tab="id-card" />} />
                        </>
                    )}

                    {/* Parent-Only Tracking Routes */}
                    <Route path="/child-profile" element={<ParentPanel tab="profile" />} />
                    <Route path="/child-attendance" element={<ParentPanel tab="attendance" />} />
                    <Route path="/child-subjects" element={<ParentPanel tab="subjects" />} />
                    <Route path="/child-timetable" element={<ParentPanel tab="timetable" />} />
                    <Route path="/child-homework" element={<ParentPanel tab="assignments" />} />
                    <Route path="/child-results" element={<ParentPanel tab="exams" />} />
                    <Route path="/child-fees" element={<ParentPanel tab="fees" />} />

                    <Route path="/teacher-performance" element={<TeacherPerformance />} />
                </Route>
            </Route>


            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
