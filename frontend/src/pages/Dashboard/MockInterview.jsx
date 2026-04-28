import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Video } from 'lucide-react';

const STORAGE_KEY = 'publishedMockInterviews';

const MockInterview = () => {
  const [meeting, setMeeting] = useState(null);
  const studentName = localStorage.getItem('studentName') || 'Jane Doe';

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setMeeting(null);
      return;
    }

    const publishedMeetings = JSON.parse(raw);
    setMeeting(publishedMeetings[studentName] || null);
  }, [studentName]);

  if (!meeting || !meeting.zoomLink) {
    return (
      <div>
        <h2 className="mb-4">Mock Interview</h2>
        <Card>
          <h3 className="mb-2">No interview meeting scheduled yet</h3>
          <p className="text-secondary">Your admin will publish your Zoom interview link here.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Mock Interview</h2>
      <Card className="mb-6">
        <h3 className="mb-2 text-primary">{meeting.title || 'Upcoming Mock Interview'}</h3>
        <p className="text-secondary mb-2">
          {meeting.date || 'Date TBA'} {meeting.time ? `at ${meeting.time}` : ''}
        </p>

        {meeting.notes && (
          <div className="mb-6" style={{ background: '#f8fafc', border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem' }}>
            <h4 className="mb-2">Notes from Admin</h4>
            <p className="text-secondary" style={{ marginBottom: 0 }}>{meeting.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="text-secondary" style={{ fontSize: '0.95rem' }}>Click below to join your Zoom interview meeting.</div>
          <a href={meeting.zoomLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Video size={18} /> Join Zoom Meeting
            </Button>
          </a>
        </div>
      </Card>

      <Card style={{ background: '#f8fafc' }}>
        <h3 className="mb-2">Interview Status <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#e2e8f0', borderRadius: '4px' }}>Scheduled</span></h3>
        <p className="text-secondary">Your admin has shared the meeting link. Join on time and keep your camera and microphone ready.</p>
      </Card>
    </div>
  );
};

export default MockInterview;
