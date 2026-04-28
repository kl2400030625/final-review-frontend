import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, BadgeInfo } from 'lucide-react';

const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStudents = (students) => {
  if (!Array.isArray(students)) return [];

  return students.map((student) => ({
    id: student.id || student.email || `name:${(student.name || 'student').toLowerCase()}`,
    name: student.name || 'Student',
    email: student.email || '',
    selectedCareer: student.selectedCareer || 'Not selected',
    counselorName: student.counselorName || '',
    counselorDesignation: student.counselorDesignation || '',
    counselorPhone: student.counselorPhone || '',
    counselorEmail: student.counselorEmail || '',
    counselorNotes: student.counselorNotes || '',
  }));
};

const AdminCounsellorDetails = () => {
  const [students, setStudents] = useState(() => normalizeStudents(parseJson(localStorage.getItem(STUDENTS_KEY), [])));
  const [selectedStudentId, setSelectedStudentId] = useState(() => {
    const initial = normalizeStudents(parseJson(localStorage.getItem(STUDENTS_KEY), []));
    return initial[0]?.id || '';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.selectedCareer.toLowerCase().includes(query)
      );
    });
  }, [students, searchQuery]);

  const selectedStudent = students.find((student) => student.id === selectedStudentId) || null;

  const updateSelectedStudent = (field, value) => {
    setStudents((prev) => prev.map((student) => (student.id === selectedStudentId ? { ...student, [field]: value } : student)));
    setMessage('');
  };

  const saveCounsellorDetails = () => {
    if (!selectedStudent) return;

    const normalized = students.map((student) => {
      if (student.id !== selectedStudentId) return student;
      return {
        ...student,
        counselorName: student.counselorName.trim(),
        counselorDesignation: student.counselorDesignation.trim(),
        counselorPhone: student.counselorPhone.trim(),
        counselorEmail: student.counselorEmail.trim(),
        counselorNotes: student.counselorNotes.trim(),
      };
    });

    localStorage.setItem(STUDENTS_KEY, JSON.stringify(normalized));
    setStudents(normalized);
    setMessage(`Counsellor details updated for ${selectedStudent.name}.`);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Counsellor Details</h2>
      <p className="text-secondary" style={{ marginBottom: '1.25rem' }}>
        Select a student and add counsellor information that appears on the student sidebar.
      </p>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(300px, 1fr) minmax(0, 1.6fr)' }}>
        <Card style={{ padding: '1.2rem' }}>
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', borderRadius: '10px', padding: '0.7rem 0.9rem', marginBottom: '1rem' }}>
            <Search size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Search student by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', boxShadow: 'none' }}
            />
          </div>

          <div className="flex flex-col gap-2" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {filteredStudents.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    setMessage('');
                  }}
                  style={{
                    textAlign: 'left',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid #dfe1e6',
                    background: isSelected ? 'rgba(0,82,204,0.08)' : 'white',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{student.name}</div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{student.email || 'No email'}</div>
                </button>
              );
            })}

            {!filteredStudents.length && <p className="text-secondary">No students found.</p>}
          </div>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          {!selectedStudent ? (
            <p className="text-secondary">Select a student to add counsellor details.</p>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <BadgeInfo size={18} style={{ color: 'var(--color-accent)' }} />
                <h3 style={{ margin: 0 }}>Assign Counsellor for {selectedStudent.name}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Counsellor Name"
                  value={selectedStudent.counselorName}
                  onChange={(e) => updateSelectedStudent('counselorName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Designation"
                  value={selectedStudent.counselorDesignation}
                  onChange={(e) => updateSelectedStudent('counselorDesignation', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={selectedStudent.counselorPhone}
                  onChange={(e) => updateSelectedStudent('counselorPhone', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={selectedStudent.counselorEmail}
                  onChange={(e) => updateSelectedStudent('counselorEmail', e.target.value)}
                />
                <textarea
                  className="md:col-span-2"
                  rows="4"
                  placeholder="Counsellor Notes"
                  value={selectedStudent.counselorNotes}
                  onChange={(e) => updateSelectedStudent('counselorNotes', e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Button variant="accent" onClick={saveCounsellorDetails}>Save Details</Button>
                {message && <span style={{ color: '#28a745', fontSize: '0.9rem' }}>{message}</span>}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminCounsellorDetails;