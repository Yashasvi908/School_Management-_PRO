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
    const { user } = useSelector((state) => state.auth || {});
    const role = user?.role;
    const isAdmin = ['admin', 'superadmin', 'principal'].includes(role);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/setup-account" element={<SetupAccount />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    
                    {/* Management Routes */}
                    <Route path="/attendance" element={isAdmin ? <Dashboard /> : <Attendance />} />
                    <Route path="/fees" element={isAdmin ? <Dashboard /> : <Fees />} />
                    <Route path="/exams" element={isAdmin ? <Dashboard /> : <Exams />} />
                    
                    {/* Academic Routes */}
                    <Route path="/timetable" element={isAdmin ? <Dashboard /> : <StudentPanel tab="timetable" />} />
                    <Route path="/subjects" element={isAdmin ? <Dashboard /> : <StudentPanel tab="subjects" />} />
                    
                    {/* Communication Routes */}
                    <Route path="/notices" element={isAdmin ? <Dashboard /> : <StudentPanel tab="notices" />} />
                    
                    {/* Resource Routes */}
                    <Route path="/library" element={isAdmin ? <Dashboard /> : <Library />} />
                    <Route path="/transport" element={isAdmin ? <Dashboard /> : <Transport />} />

                    {/* Admin-Only Dedicated Paths */}
                    {isAdmin && (
                        <>
                            <Route path="/teachers" element={<Dashboard />} />
                            <Route path="/staff" element={<Dashboard />} />
                            <Route path="/students" element={<Dashboard />} />
                            <Route path="/users" element={<Dashboard />} />
                            <Route path="/classes" element={<Dashboard />} />
                            <Route path="/sections" element={<Dashboard />} />
                            <Route path="/analytics" element={<Dashboard />} />
                            <Route path="/security" element={<Dashboard />} />
                            <Route path="/backup" element={<Dashboard />} />
                        </>
                    )}

                    {/* Non-Admin Specific Paths */}
                    {!isAdmin && (
                        <>
                            <Route path="/student-dashboard" element={<StudentPanel />} />
                            <Route path="/teacher-dashboard" element={<TeacherPanel />} />
                            <Route path="/parent-dashboard" element={<ParentPanel />} />
                            <Route path="/assignments" element={<StudentPanel tab="assignments" />} />
                            <Route path="/study-materials" element={<StudentPanel tab="study-materials" />} />
                            <Route path="/id-card" element={<StudentPanel tab="id-card" />} />
                        </>
                    )}

                    {/* Shared Routes */}
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/live-classes" element={<LiveClasses />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analytics" element={<Analytics />} />

                    {/* Parent-Only Tracking Routes */}
                    <Route path="/child-profile" element={<ParentPanel tab="profile" />} />
                    <Route path="/child-attendance" element={<ParentPanel tab="attendance" />} />
                    <Route path="/child-subjects" element={<ParentPanel tab="subjects" />} />
                    <Route path="/child-timetable" element={<ParentPanel tab="timetable" />} />
                    <Route path="/child-homework" element={<ParentPanel tab="assignments" />} />
                    <Route path="/child-results" element={<ParentPanel tab="exams" />} />
                    <Route path="/child-fees" element={<ParentPanel tab="fees" />} />

                    <Route path="/upload-lecture" element={<LectureUpload />} />
                    <Route path="/teacher-performance" element={<TeacherPerformance />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
