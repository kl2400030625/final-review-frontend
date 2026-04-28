import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Users, FileBox, ShieldAlert, LogOut, FileText, Video, Briefcase, GraduationCap, Award, BadgeInfo, Presentation } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'System Monitoring', path: '/admin-dashboard', icon: <Activity size={20} /> },
    { name: 'User Management', path: '/admin-dashboard/users', icon: <Users size={20} /> },
    { name: 'Assessments', path: '/admin-dashboard/assessments', icon: <FileBox size={20} /> },
    { name: 'Content Upload', path: '/admin-dashboard/content', icon: <FileBox size={20} /> },
    { name: 'Universities', path: '/admin-dashboard/universities', icon: <GraduationCap size={20} /> },
    { name: 'Scholarships', path: '/admin-dashboard/scholarships', icon: <Award size={20} /> },
    { name: 'Internships', path: '/admin-dashboard/internships', icon: <Briefcase size={20} /> },
    { name: 'Counsellor Details', path: '/admin-dashboard/counsellors', icon: <BadgeInfo size={20} /> },
    { name: 'Mock Interviews', path: '/admin-dashboard/mock-interviews', icon: <Briefcase size={20} /> },
    { name: 'Resume Review', path: '/admin-dashboard/resumes', icon: <FileText size={20} /> },
    { name: 'Workshops', path: '/admin-dashboard/workshops', icon: <Presentation size={20} /> },
    { name: 'Webinars', path: '/admin-dashboard/webinars', icon: <Video size={20} /> },
  ];

  return (
    <aside style={{ width: '260px', background: '#0b1626', color: 'white', display: 'flex', flexDirection: 'column', padding: '1.5rem', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <ShieldAlert size={24} style={{ color: 'var(--color-accent)' }} />
          Admin Portal
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/admin-dashboard' && location.pathname === '/admin-dashboard');
          return (
            <Link 
              key={item.name} 
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
                borderRadius: '8px', color: isActive ? 'white' : '#8c9ab3',
                background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '500', textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', color: '#8c9ab3', textDecoration: 'none' }}>
          <LogOut size={20} /> Logout
        </Link>
      </div>
    </aside>
  );
};

const AdminLayout = () => {
  return (
    <div className="dashboard-layout" style={{ background: '#f4f6f8' }}>
      <AdminSidebar />
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
};
export default AdminLayout;