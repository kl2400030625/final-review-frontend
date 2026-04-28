import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, BookOpen, BookCheck, Video, LogOut, GraduationCap, Award, BadgeInfo, Presentation } from 'lucide-react';

const DEFAULT_STUDENT_INFO = {
  email: 'sai@gmail.com',
  selectedCareer: 'Not selected',
};

const buildDefaultEmailFromName = (name) => {
  const normalized = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.');

  if (!normalized) return DEFAULT_STUDENT_INFO.email;
  return `${normalized}@gmail.com`;
};

const Sidebar = () => {
  const location = useLocation();
  const [studentName, setStudentName] = useState('Jane Doe');
  const [studentInfo, setStudentInfo] = useState(DEFAULT_STUDENT_INFO);

  useEffect(() => {
    const savedName = localStorage.getItem('studentName');
    if (savedName) setStudentName(savedName);

    try {
      const students = JSON.parse(localStorage.getItem('guidance_plus_students') || '[]');
      const matchedStudent = Array.isArray(students)
        ? students.find((student) => (student?.name || '').trim().toLowerCase() === (savedName || studentName).trim().toLowerCase())
        : null;

      if (matchedStudent) {
        setStudentInfo({
          email: matchedStudent.email || buildDefaultEmailFromName(matchedStudent.name || savedName),
          selectedCareer: matchedStudent.selectedCareer || 'Not selected',
        });
      } else {
        setStudentInfo({
          email: buildDefaultEmailFromName(savedName || studentName),
          selectedCareer: DEFAULT_STUDENT_INFO.selectedCareer,
        });
      }
    } catch {
      setStudentInfo(DEFAULT_STUDENT_INFO);
    }
  }, []);
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Assessment', path: '/dashboard/assessment', icon: <BookCheck size={20} /> },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: <FileText size={20} /> },
    { name: 'Mock Interview', path: '/dashboard/interview', icon: <Briefcase size={20} /> },
    { name: 'Universities', path: '/dashboard/universities', icon: <GraduationCap size={20} /> },
    { name: 'Scholarships', path: '/dashboard/scholarships', icon: <Award size={20} /> },
    { name: 'Internships', path: '/dashboard/internships', icon: <Briefcase size={20} /> },
    { name: 'Counsellor Details', path: '/dashboard/counsellor-details', icon: <BadgeInfo size={20} /> },
    { name: 'Resources', path: '/dashboard/resources', icon: <BookOpen size={20} /> },
    { name: 'Workshops', path: '/dashboard/workshops', icon: <Presentation size={20} /> },
    { name: 'Webinars', path: '/dashboard/webinars', icon: <Video size={20} /> },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid #dfe1e6',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 className="text-primary" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              background: 'var(--color-primary-gradient)', 
              color: 'white', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '8px' 
            }}>G</span>
            Guidance<span style={{ color: 'var(--color-accent)' }}>+</span>
          </h2>
        </Link>
      </div>

      <div style={{ marginBottom: '1.25rem', padding: '0.9rem 1rem', borderRadius: '14px', background: 'rgba(0,82,204,0.06)', border: '1px solid rgba(0,82,204,0.12)' }}>
        <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{studentName}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{studentInfo.email}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{studentInfo.selectedCareer}</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard');
          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0, 82, 204, 0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #dfe1e6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {studentName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{studentName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Student</div>
          </div>
        </div>
        <Link to="/" onClick={() => localStorage.removeItem('studentName')} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          <LogOut size={18} /> Log Out
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
