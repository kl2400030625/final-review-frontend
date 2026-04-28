import React, { useMemo } from 'react';
import Card from '../../components/Card';
import { BadgeInfo, Mail, Phone } from 'lucide-react';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeName = (value) => (value || '').trim().toLowerCase();

const CounsellorDetails = () => {
  const userName = localStorage.getItem('studentName') || 'Student';

  const counselor = useMemo(() => {
    const students = parseJson(localStorage.getItem('guidance_plus_students'), []);
    const student = Array.isArray(students)
      ? students.find((item) => normalizeName(item?.name) === normalizeName(userName))
      : null;

    if (!student || !student.counselorName) return null;

    return {
      name: student.counselorName,
      designation: student.counselorDesignation || 'Counsellor',
      phone: student.counselorPhone || '',
      email: student.counselorEmail || '',
      notes: student.counselorNotes || '',
    };
  }, [userName]);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <h2 className="mb-2" style={{ fontSize: '2rem' }}>Counsellor Details</h2>
      <p className="text-secondary mb-6">Your assigned counsellor information from admin.</p>

      <Card style={{ padding: '1.2rem' }}>
        <div className="flex items-center gap-2 mb-3">
          <BadgeInfo size={20} style={{ color: 'var(--color-accent)' }} />
          <h3 style={{ margin: 0 }}>Assigned Counsellor</h3>
        </div>

        {counselor ? (
          <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.96rem' }}>
            <div><strong>{counselor.name}</strong></div>
            <div>{counselor.designation}</div>
            {counselor.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={15} /> {counselor.phone}
              </div>
            )}
            {counselor.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} /> {counselor.email}
              </div>
            )}
            {counselor.notes && <p className="text-secondary" style={{ marginBottom: 0 }}>{counselor.notes}</p>}
          </div>
        ) : (
          <p className="text-secondary" style={{ marginBottom: 0 }}>No counsellor has been assigned yet.</p>
        )}
      </Card>
    </div>
  );
};

export default CounsellorDetails;