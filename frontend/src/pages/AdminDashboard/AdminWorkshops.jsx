import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Presentation, Search } from 'lucide-react';

const STORAGE_KEY = 'publishedWorkshops';
const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStudentName = (name) => (name || '').trim();

const createDefaultSession = () => ({
  title: '',
  trainer: '',
  date: '',
  time: '',
  mode: 'Online',
  link: '',
  badge: '',
});

const normalizeLink = (link) => {
  const trimmed = link.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const AdminWorkshops = () => {
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
  const [sessionsByStudent, setSessionsByStudent] = useState(() => {
    const published = parseJson(localStorage.getItem(STORAGE_KEY), {});
    const initial = {};
    students.forEach((student) => {
      initial[student.name] = Array.isArray(published[student.name]) ? published[student.name] : [];
    });
    return initial;
  });
  const [publishMessage, setPublishMessage] = useState('');

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => student.name.toLowerCase().includes(query));
  }, [searchQuery, students]);

  const selectedSessions = sessionsByStudent[selectedStudent] || [];

  const updateSession = (index, field, value) => {
    if (!selectedStudent) return;

    setSessionsByStudent((prev) => {
      const nextSessions = [...(prev[selectedStudent] || [])];
      nextSessions[index] = { ...nextSessions[index], [field]: value };
      return {
        ...prev,
        [selectedStudent]: nextSessions,
      };
    });
  };

  const addSession = () => {
    if (!selectedStudent) return;

    setSessionsByStudent((prev) => ({
      ...prev,
      [selectedStudent]: [...(prev[selectedStudent] || []), createDefaultSession()],
    }));
  };

  const removeSession = (index) => {
    if (!selectedStudent) return;

    setSessionsByStudent((prev) => {
      const remaining = (prev[selectedStudent] || []).filter((_, sessionIndex) => sessionIndex !== index);
      return {
        ...prev,
        [selectedStudent]: remaining,
      };
    });
  };

  const publishWorkshops = () => {
    const studentKey = normalizeStudentName(selectedStudent);
    if (!studentKey) return;

    const normalizedSessions = selectedSessions
      .map((session) => ({ ...session, link: normalizeLink(session.link) }))
      .filter((session) => session.title.trim() && session.link);

    if (!normalizedSessions.length) {
      setPublishMessage('Add at least one workshop with title and valid link before publishing.');
      return;
    }

    const publishedWorkshops = parseJson(localStorage.getItem(STORAGE_KEY), {});

    publishedWorkshops[studentKey] = normalizedSessions;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(publishedWorkshops));

    setSessionsByStudent((prev) => ({
      ...prev,
      [studentKey]: normalizedSessions,
    }));
    setPublishMessage(`Workshops published for ${studentKey}.`);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <h2 className="mb-6" style={{ fontSize: '2.35rem' }}>Workshops</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>Create and publish workshops per student.</p>

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
              <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Select a student to schedule workshops.</p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ padding: '0.75rem', background: '#f4f5f7', borderRadius: '12px' }}>
                      <Presentation className="text-primary" size={22} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.65rem' }}>Workshops: {selectedStudent}</h3>
                  </div>
                  <Button variant="accent" onClick={publishWorkshops}>Publish Workshops</Button>
                </div>

                {publishMessage && (
                  <p className="text-sm" style={{ color: publishMessage.startsWith('Add') ? 'var(--color-accent)' : '#28a745', marginTop: '-0.25rem', marginBottom: '1.25rem', fontSize: '0.98rem' }}>
                    {publishMessage}
                  </p>
                )}

                <div className="flex flex-col gap-5">
                  {!selectedSessions.length && (
                    <p className="text-secondary text-sm" style={{ fontSize: '1rem' }}>No workshop sessions added yet. Click + Add Workshop.</p>
                  )}
                  {selectedSessions.map((session, index) => (
                    <div key={`${session.title}-${index}`} style={{ border: '1px solid #dfe1e6', borderRadius: '12px', padding: '1rem' }}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Workshop Title"
                          value={session.title}
                          onChange={(e) => updateSession(index, 'title', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Trainer Name"
                          value={session.trainer}
                          onChange={(e) => updateSession(index, 'trainer', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />
                        <input
                          type="date"
                          value={session.date}
                          onChange={(e) => updateSession(index, 'date', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />
                        <input
                          type="text"
                          placeholder="10:00 AM - 12:00 PM"
                          value={session.time}
                          onChange={(e) => updateSession(index, 'time', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />
                        <select
                          value={session.mode}
                          onChange={(e) => updateSession(index, 'mode', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        >
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                        <input
                          type="url"
                          placeholder="https://zoom.us/j/..."
                          value={session.link}
                          onChange={(e) => updateSession(index, 'link', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />
                        <input
                          className="md:col-span-2"
                          type="text"
                          placeholder="Badge (e.g., New Batch)"
                          value={session.badge}
                          onChange={(e) => updateSession(index, 'badge', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />
                      </div>

                      <div className="mt-3">
                        <Button variant="ghost" onClick={() => removeSession(index)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.95rem' }}>
                          Remove Workshop
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Button variant="primary" onClick={addSession} style={{ padding: '0.6rem 1.05rem', fontSize: '0.95rem' }}>
                    + Add Workshop
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkshops;