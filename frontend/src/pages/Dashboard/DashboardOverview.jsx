import React from 'react';
import Card from '../../components/Card';
import { BookCheck, Briefcase, FileText, GraduationCap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
  const nav = useNavigate();
  const userName = localStorage.getItem('studentName') || 'Student';

  return (
    <div>
      <h2 className="mb-2">Welcome back, {userName}! 👋</h2>
      <p className="text-secondary mb-8">Ready to take the next step in your career journey?</p>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <Card className="flex flex-col items-center justify-center p-8 text-center" style={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }} onClick={() => nav('/dashboard/assessment')}>
          <div style={{ padding: '1rem', background: 'rgba(0,82,204,0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <BookCheck size={32} className="text-primary" />
          </div>
          <h3 className="mb-2">Assessments</h3>
          <p className="text-secondary text-sm">Discover your skills</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-8 text-center" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => nav('/dashboard/resume')}>
          <div style={{ padding: '1rem', background: '#f4f5f7', borderRadius: '50%', marginBottom: '1rem' }}>
            <FileText size={32} className="text-secondary" />
          </div>
          <h3 className="mb-2">Resume Score</h3>
          <p className="text-secondary text-sm">Analyze your CV</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-8 text-center" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => nav('/dashboard/universities')}>
          <div style={{ padding: '1rem', background: 'rgba(0,82,204,0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <GraduationCap size={32} className="text-primary" />
          </div>
          <h3 className="mb-2">Universities</h3>
          <p className="text-secondary text-sm">Find colleges by career and budget</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-8 text-center" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => nav('/dashboard/scholarships')}>
          <div style={{ padding: '1rem', background: 'rgba(40,167,69,0.12)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Award size={32} style={{ color: '#28a745' }} />
          </div>
          <h3 className="mb-2">Scholarships</h3>
          <p className="text-secondary text-sm">Explore funding opportunities</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-8 text-center" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => nav('/dashboard/internships')}>
          <div style={{ padding: '1rem', background: 'rgba(255,127,0,0.12)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Briefcase size={32} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h3 className="mb-2">Internships</h3>
          <p className="text-secondary text-sm">Find roles and stipends</p>
        </Card>

        <Card>
          <h3 className="mb-4">Recent Notifications</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ padding: '1rem 0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Briefcase className="text-secondary"/>
              <span>New mock interview modules are available.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
export default DashboardOverview;
