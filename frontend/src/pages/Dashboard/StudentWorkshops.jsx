import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Calendar, Clock, Link as LinkIcon, Presentation } from 'lucide-react';

const STORAGE_KEY = 'publishedWorkshops';

const normalizeStudentName = (name) => (name || '').trim();

const getSessionsForStudent = (publishedWorkshops, studentName) => {
  const normalized = normalizeStudentName(studentName);
  if (!normalized) return [];

  if (Array.isArray(publishedWorkshops[normalized])) {
    return publishedWorkshops[normalized];
  }

  const matchKey = Object.keys(publishedWorkshops).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );

  if (matchKey && Array.isArray(publishedWorkshops[matchKey])) {
    return publishedWorkshops[matchKey];
  }

  return [];
};

const StudentWorkshops = () => {
  const [sessions, setSessions] = useState([]);
  const studentName = normalizeStudentName(localStorage.getItem('studentName') || 'Jane Doe');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setSessions([]);
      return;
    }

    const publishedWorkshops = JSON.parse(raw);
    setSessions(getSessionsForStudent(publishedWorkshops, studentName));
  }, [studentName]);

  if (!sessions.length) {
    return (
      <div>
        <h2 className="mb-4">Workshops</h2>
        <p className="text-secondary mb-8">Join hands-on workshops to build practical career skills.</p>
        <Card>
          <h3 className="mb-2">No workshop assigned yet</h3>
          <p className="text-secondary">Your admin will publish workshops here.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Workshops</h2>
      <p className="text-secondary mb-8">Join hands-on workshops to build practical career skills.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {sessions.map((session, index) => (
          <Card key={`${session.title}-${index}`}>
            <div className="flex justify-between items-start mb-4">
              <div style={{ padding: '0.75rem', background: 'rgba(0,82,204,0.1)', borderRadius: '8px' }}>
                <Presentation className="text-primary" />
              </div>
              {session.badge && (
                <span style={{ fontSize: '0.75rem', background: 'var(--color-accent)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
                  {session.badge}
                </span>
              )}
            </div>
            <h3 className="mb-2">{session.title || `Workshop ${index + 1}`}</h3>
            <p className="text-secondary mb-4 text-sm">{session.trainer || 'Trainer details will be shared by admin'}</p>

            <div className="flex-col gap-2 mb-6 text-sm text-secondary">
              <div className="flex items-center gap-2"><Calendar size={16} /> {session.date || 'Date TBA'}</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {session.time || 'Time TBA'}</div>
              <div className="flex items-center gap-2">Mode: {session.mode || 'Online'}</div>
            </div>

            <a href={session.link || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <Button style={{ width: '100%' }} variant="primary"><LinkIcon size={16} className="mr-2" /> Join Workshop</Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentWorkshops;