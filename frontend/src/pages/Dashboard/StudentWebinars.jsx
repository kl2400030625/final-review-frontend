import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Video, Calendar, Clock, Link as LinkIcon } from 'lucide-react';

const STORAGE_KEY = 'publishedWebinars';

const normalizeStudentName = (name) => (name || '').trim();

const getSessionsForStudent = (publishedWebinars, studentName) => {
  const normalized = normalizeStudentName(studentName);
  if (!normalized) return [];

  if (Array.isArray(publishedWebinars[normalized])) {
    return publishedWebinars[normalized];
  }

  const matchKey = Object.keys(publishedWebinars).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );

  if (matchKey && Array.isArray(publishedWebinars[matchKey])) {
    return publishedWebinars[matchKey];
  }

  return [];
};

const StudentWebinars = () => {
  const [sessions, setSessions] = useState([]);
  const studentName = normalizeStudentName(localStorage.getItem('studentName') || 'Jane Doe');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setSessions([]);
      return;
    }

    const publishedWebinars = JSON.parse(raw);
    setSessions(getSessionsForStudent(publishedWebinars, studentName));
  }, [studentName]);

  if (!sessions.length) {
    return (
      <div>
        <h2 className="mb-4">Upcoming Webinars & Counseling</h2>
        <p className="text-secondary mb-8">Join scheduled live sessions to get expert advice and insights.</p>
        <Card>
          <h3 className="mb-2">No webinar assigned yet</h3>
          <p className="text-secondary">Your admin will publish webinar sessions here.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Upcoming Webinars & Counseling</h2>
      <p className="text-secondary mb-8">Join scheduled live sessions to get expert advice and insights.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {sessions.map((session, index) => (
          <Card key={`${session.title}-${index}`}>
            <div className="flex justify-between items-start mb-4">
              <div style={{ padding: '0.75rem', background: 'rgba(0,82,204,0.1)', borderRadius: '8px' }}>
                <Video className="text-primary" />
              </div>
              {session.badge && (
                <span style={{ fontSize: '0.75rem', background: 'var(--color-accent)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
                  {session.badge}
                </span>
              )}
            </div>
            <h3 className="mb-2">{session.title || `Webinar ${index + 1}`}</h3>
            <p className="text-secondary mb-4 text-sm">{session.host || 'Hosted by admin'}</p>

            <div className="flex-col gap-2 mb-6 text-sm text-secondary">
              <div className="flex items-center gap-2"><Calendar size={16} /> {session.date || 'Date TBA'}</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {session.time || 'Time TBA'}</div>
            </div>

            <a href={session.link || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <Button style={{ width: '100%' }} variant="primary"><LinkIcon size={16} className="mr-2" /> Join Session</Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentWebinars;
