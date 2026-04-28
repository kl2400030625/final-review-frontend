import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './components/Register.jsx';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import Assessment from './pages/Dashboard/Assessment';
import ResumeAnalyzer from './pages/Dashboard/ResumeAnalyzer';
import MockInterview from './pages/Dashboard/MockInterview';
import Resources from './pages/Dashboard/Resources';
import StudentWebinars from './pages/Dashboard/StudentWebinars';
import StudentWorkshops from './pages/Dashboard/StudentWorkshops';
import UniversitiesReference from './pages/Dashboard/UniversitiesReference';
import ScholarshipsReference from './pages/Dashboard/ScholarshipsReference';
import InternshipsReference from './pages/Dashboard/InternshipsReference';
import CounsellorDetails from './pages/Dashboard/CounsellorDetails';

// Admin Imports
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminDashboard/AdminLayout';
import AdminOverview from './pages/AdminDashboard/AdminOverview';
import UserManagement from './pages/AdminDashboard/UserManagement';
import AssessmentManagement from './pages/AdminDashboard/AssessmentManagement';
import ContentManagement from './pages/AdminDashboard/ContentManagement';
import ResumeReview from './pages/AdminDashboard/ResumeReview';
import AdminWebinars from './pages/AdminDashboard/AdminWebinars';
import AdminWorkshops from './pages/AdminDashboard/AdminWorkshops';
import AdminMockInterview from './pages/AdminDashboard/AdminMockInterview';
import AdminUniversities from './pages/AdminDashboard/AdminUniversities';
import AdminScholarships from './pages/AdminDashboard/AdminScholarships';
import AdminInternships from './pages/AdminDashboard/AdminInternships';
import AdminCounsellorDetails from './pages/AdminDashboard/AdminCounsellorDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="interview" element={<MockInterview />} />
          <Route path="universities" element={<UniversitiesReference />} />
          <Route path="scholarships" element={<ScholarshipsReference />} />
          <Route path="internships" element={<InternshipsReference />} />
          <Route path="counsellor-details" element={<CounsellorDetails />} />
          <Route path="contests" element={<Navigate to="/dashboard" replace />} />
          <Route path="planner" element={<Navigate to="/dashboard" replace />} />
          <Route path="resources" element={<Resources />} />
          <Route path="workshops" element={<StudentWorkshops />} />
          <Route path="webinars" element={<StudentWebinars />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="assessments" element={<AssessmentManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="universities" element={<AdminUniversities />} />
          <Route path="scholarships" element={<AdminScholarships />} />
          <Route path="internships" element={<AdminInternships />} />
          <Route path="counsellors" element={<AdminCounsellorDetails />} />
          <Route path="mock-interviews" element={<AdminMockInterview />} />
          <Route path="coding-contests" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="study-plans" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="resumes" element={<ResumeReview />} />
          <Route path="workshops" element={<AdminWorkshops />} />
          <Route path="webinars" element={<AdminWebinars />} />
          <Route path="maintenance" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
