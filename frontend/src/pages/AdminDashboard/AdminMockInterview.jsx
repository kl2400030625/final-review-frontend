import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, Video } from 'lucide-react';

const STORAGE_KEY = 'publishedMockInterviews';
const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStudentName = (name) => (name || '').trim();

const createEmptyMeeting = () => ({
  title: '',
  date: '',
  time: '',
  zoomLink: '',
  notes: '',
});

const normalizeZoomLink = (link) => {
  const trimmed = link.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const AdminMockInterview = () => {
  const students = useMemo(() => {
    const registry = parseJson(localStorage.getItem(STUDENTS_KEY), []);
    if (!Array.isArray(registry)) return [];

    const mapped = registry
      .filter((student) => student?.name)
      .map((student) => ({
        name: normalizeStudentName(student.name),
        target: student.selectedCareer || 'Not selected',
      }))
      .filter((student) => student.name);

    return Array.from(new Map(mapped.map((student) => [student.name.toLowerCase(), student])).values());
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.name || '');
  const [meetings, setMeetings] = useState(() => {
    const publishedMeetings = parseJson(localStorage.getItem(STORAGE_KEY), {});
    const initial = {};
    students.forEach((student) => {
      initial[student.name] = publishedMeetings[student.name] || createEmptyMeeting();
    });
    return initial;
  });
  const [publishMessage, setPublishMessage] = useState('');

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => student.name.toLowerCase().includes(query));
  }, [searchQuery, students]);

  const selectedMeeting = meetings[selectedStudent];

  const handleFieldChange = (field, value) => {
    if (!selectedStudent) return;

    setMeetings((prev) => ({
      ...prev,
      [selectedStudent]: {
        ...(prev[selectedStudent] || createEmptyMeeting()),
        [field]: value,
      },
    }));
  };

  const publishMeeting = () => {
    const studentKey = normalizeStudentName(selectedStudent);
    if (!studentKey) return;

    const currentMeeting = meetings[studentKey] || createEmptyMeeting();

    const zoomLink = normalizeZoomLink(currentMeeting.zoomLink);
    if (!zoomLink) {
      setPublishMessage('Please add a valid Zoom meeting link before publishing.');
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    const publishedMeetings = raw ? JSON.parse(raw) : {};

    publishedMeetings[studentKey] = {
      ...currentMeeting,
      zoomLink,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(publishedMeetings));
    setMeetings((prev) => ({
      ...prev,
      [studentKey]: {
        ...(prev[studentKey] || createEmptyMeeting()),
        zoomLink,
      },
    }));
    setPublishMessage(`Mock interview link published for ${studentKey}.`);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <h2 className="mb-6" style={{ fontSize: '2.35rem' }}>Mock Interview Meetings</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>Create and publish Zoom meeting links for student mock interviews.</p>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(320px, 1.05fr) minmax(0, 1.9fr)' }}>
        <div className="md:col-span-1">
          <Card className="h-full" style={{ padding: '2rem' }}>
            <h3 className="mb-4" style={{ fontSize: '1.45rem' }}>Select Student</h3>
            <div className="flex items-center gap-3 mb-4" style={{ background: '#f4f5f7', padding: '0.85rem 1rem', borderRadius: '12px' }}>
              <Search className="text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem' }}
              />
            </div>

            <div className="flex flex-col gap-3">
              {!filteredStudents.length && (
                <p className="text-secondary text-sm" style={{ fontSize: '1rem' }}>No students found in User Management.</p>
              )}
              {filteredStudents.map((student) => {
                const isSelected = selectedStudent === student.name;
                return (
                  <button
                    key={student.name}
                    type="button"
                    onClick={() => {
                      setSelectedStudent(student.name);
                      setPublishMessage('');
                    }}
                    style={{
                      padding: '1rem 1.05rem',
                      background: isSelected ? 'rgba(0,82,204,0.1)' : 'white',
                      border: isSelected ? '1px solid var(--color-primary)' : '1px solid #dfe1e6',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <strong style={{ fontSize: '1rem' }}>{student.name}</strong>
                    <p className="text-secondary text-sm" style={{ fontSize: '0.92rem' }}>Target: {student.target}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full" style={{ padding: '2rem' }}>
            {!selectedStudent ? (
              <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Select a student to schedule a Zoom interview meeting.</p>
            ) : (
              <>
            <div className="flex justify-between items-center mb-6" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div className="flex items-center gap-3">
                <div style={{ padding: '0.75rem', background: '#f4f5f7', borderRadius: '12px' }}>
                  <Video className="text-primary" size={22} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.65rem' }}>Interview: {selectedStudent}</h3>
              </div>
              <Button variant="accent" onClick={publishMeeting}>Publish Meeting</Button>
            </div>

            {publishMessage && (
              <p className="text-sm" style={{ color: publishMessage.startsWith('Please') ? 'var(--color-accent)' : '#28a745', marginTop: '-0.25rem', marginBottom: '1.25rem', fontSize: '0.98rem' }}>
                {publishMessage}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label style={{ fontSize: '1rem' }}>Meeting Title</label>
                <input
                  type="text"
                  value={selectedMeeting.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Behavioral Round 1"
                  style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '1rem' }}>Date</label>
                <input
                  type="date"
                  value={selectedMeeting.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '1rem' }}>Time</label>
                <input
                  type="time"
                  value={selectedMeeting.time}
                  onChange={(e) => handleFieldChange('time', e.target.value)}
                  style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '1rem' }}>Zoom Link</label>
                <input
                  type="url"
                  value={selectedMeeting.zoomLink}
                  onChange={(e) => handleFieldChange('zoomLink', e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div className="mt-4">
              <label style={{ fontSize: '1rem' }}>Notes (Optional)</label>
              <textarea
                rows="4"
                value={selectedMeeting.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Add interviewer instructions or preparation notes"
                style={{ width: '100%', resize: 'vertical', padding: '1rem', fontSize: '1rem', minHeight: '140px' }}
              />
            </div>
            </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminMockInterview;