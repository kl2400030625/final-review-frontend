const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const adminDir = path.join(pagesDir, 'AdminDashboard');

// Create directories if they don't exist
[pagesDir, adminDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  'AdminLogin.jsx': `
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const nav = useNavigate();
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1626' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="flex justify-center mb-4">
          <Shield size={48} className="text-primary" />
        </div>
        <h2 className="text-center mb-2" style={{ color: '#172b4d' }}>Admin Portal</h2>
        <p className="text-center mb-8 text-secondary">Secure access for system administrators</p>
        <form onSubmit={(e) => { e.preventDefault(); nav('/admin-dashboard'); }}>
          <div className="mb-4">
            <label>Admin ID or Email</label>
            <input type="email" placeholder="admin@guidanceplus.com" required />
          </div>
          <div className="mb-8">
            <label>Admin Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" style={{ width: '100%' }}>Secure Login</Button>
          <div className="text-center mt-6">
            <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Return to Student Portal</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default AdminLogin;`,

  'AdminDashboard/AdminLayout.jsx': `
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Users, Settings, FileBox, Database, ShieldAlert, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'System Monitoring', path: '/admin-dashboard', icon: <Activity size={20} /> },
    { name: 'User Management', path: '/admin-dashboard/users', icon: <Users size={20} /> },
    { name: 'Assessments', path: '/admin-dashboard/assessments', icon: <FileBox size={20} /> },
    { name: 'Career Data', path: '/admin-dashboard/careers', icon: <Database size={20} /> },
    { name: 'Content Upload', path: '/admin-dashboard/content', icon: <Database size={20} /> },
    { name: 'Maintenance', path: '/admin-dashboard/maintenance', icon: <Settings size={20} /> },
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
export default AdminLayout;`,

  'AdminDashboard/AdminOverview.jsx': `
import React from 'react';
import Card from '../../components/Card';
import { Users, Activity, AlertCircle, TrendingUp } from 'lucide-react';

const AdminOverview = () => {
  return (
    <div>
      <h2 className="mb-6">System Monitoring & Overview</h2>
      
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(0,82,204,0.1)', borderRadius: '8px' }}><Users className="text-primary" /></div>
          <div><h4 className="text-secondary text-sm">Total Students</h4><h2 className="text-primary">2,450</h2></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(255,127,0,0.1)', borderRadius: '8px' }}><Activity style={{ color: 'var(--color-accent)' }} /></div>
          <div><h4 className="text-secondary text-sm">Active Sessions</h4><h2>312</h2></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(40,167,69,0.1)', borderRadius: '8px' }}><TrendingUp style={{ color: '#28a745' }} /></div>
          <div><h4 className="text-secondary text-sm">Assessments Taken</h4><h2>15.2k</h2></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(220,53,69,0.1)', borderRadius: '8px' }}><AlertCircle style={{ color: '#dc3545' }} /></div>
          <div><h4 className="text-secondary text-sm">Reported Issues</h4><h2>3</h2></div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4">Recent Activity Logs</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #dfe1e6' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Time</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Event</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>User ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} style={{ borderBottom: '1px solid #dfe1e6' }}>
                <td style={{ padding: '1rem' }}>Today, 10:{40-i} AM</td>
                <td style={{ padding: '1rem' }}>User registered</td>
                <td style={{ padding: '1rem' }}>UID-{1024 + i}</td>
                <td style={{ padding: '1rem', color: '#28a745' }}>Success</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
export default AdminOverview;`,

  'AdminDashboard/UserManagement.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>User Management</h2>
        <Button variant="accent">+ Add Student</Button>
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-6" style={{ background: '#f4f5f7', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <Search className="text-secondary" size={20} />
          <input type="text" placeholder="Search students by name or email..." style={{ border: 'none', background: 'transparent', width: '100%' }} />
        </div>

        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #dfe1e6' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Class / Role</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[ {n:'John Doe', e:'john@edu.com', c:'Class 10'}, {n:'Sarah Smith', e:'sarah@edu.com', c:'Class 12'}].map((u, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #dfe1e6' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{u.n}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.e}</td>
                <td style={{ padding: '1rem' }}>{u.c}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}><Edit size={18}/></button>
                  <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc3545' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
export default UserManagement;`,

  'AdminDashboard/AssessmentManagement.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const AssessmentManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Assessment Management</h2>
        <Button>+ Create New Question</Button>
      </div>
      <Card>
        <p className="text-secondary mb-4">Manage the question banks for aptitude and career assessments.</p>
        <div style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <h4>Q: Which activity do you prefer?</h4>
          <p className="text-secondary text-sm">Category: Aptitude</p>
        </div>
        <div style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <h4>Q: Solve this logical pattern...</h4>
          <p className="text-secondary text-sm">Category: Logical Reasoning</p>
        </div>
      </Card>
    </div>
  );
};
export default AssessmentManagement;`,

  'AdminDashboard/CareerManagement.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const CareerManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Career Data Management</h2>
        <Button>+ Add Career Path</Button>
      </div>
      <Card>
        <p className="text-secondary mb-4">Update roles, requirements, and job outlooks displayed to students.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div style={{ padding: '1rem', border: '1px solid #dfe1e6', borderRadius: '8px' }}>
            <h4>Software Engineering</h4>
            <p className="text-secondary text-sm">High demand. Skills: Coding, Logic.</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #dfe1e6', borderRadius: '8px' }}>
            <h4>Data Scientist</h4>
            <p className="text-secondary text-sm">High demand. Skills: Math, Stats.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default CareerManagement;`,

  'AdminDashboard/ContentManagement.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { UploadCloud } from 'lucide-react';

const ContentManagement = () => {
  return (
    <div>
      <h2>Content Management</h2>
      <p className="text-secondary mb-6">Upload learning resources, videos, and study materials.</p>
      
      <Card className="text-center" style={{ padding: '3rem', border: '2px dashed #dfe1e6', background: 'var(--bg-main)' }}>
        <UploadCloud size={64} className="text-primary mb-4" style={{ margin: '0 auto' }} />
        <h3 className="mb-2">Upload Video / PDF</h3>
        <p className="mb-6">Deploy new materials to the student Resource tab.</p>
        <Button variant="accent">Select Files</Button>
      </Card>
    </div>
  );
};
export default ContentManagement;`,

  'AdminDashboard/Maintenance.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Maintenance = () => {
  return (
    <div>
      <h2 className="mb-6">System Maintenance</h2>
      
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3>Maintenance Mode</h3>
            <p className="text-secondary text-sm">Take the student portal offline for upgrades.</p>
          </div>
          <Button variant="outline" style={{ borderColor: '#dc3545', color: '#dc3545' }}>Activate Maintenance</Button>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3>Cache Clearing</h3>
            <p className="text-secondary text-sm">Clear global cache to apply new assessment updates.</p>
          </div>
          <Button variant="primary">Clear Cache</Button>
        </div>
      </Card>
    </div>
  );
};
export default Maintenance;`
};

Object.entries(files).forEach(([fPath, content]) => {
  const fullPath = path.join(pagesDir, fPath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Created Admin:', fullPath);
});
