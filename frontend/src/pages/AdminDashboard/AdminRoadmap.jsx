import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, Map } from 'lucide-react';

const STORAGE_KEY = 'publishedRoadmaps';
const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const createDefaultRoadmap = () => ({
  title: 'Personalized Career Roadmap',
  phases: [
    { title: 'Phase 1: Foundation', description: 'Complete React Basics and UI frameworks.', status: 'completed' },
    { title: 'Phase 2: Backend Understanding', description: 'Learn Node.js and basic databases.', status: 'in-progress' },
    { title: 'Phase 3: Real-world Application', description: 'Build a full-stack project.', status: 'pending' },
  ],
});

const AdminRoadmap = () => {
  const students = useMemo(() => {
    const registry = parseJson(localStorage.getItem(STUDENTS_KEY), []);
    const mappedFromRegistry = Array.isArray(registry)
      ? registry
          .filter((student) => student?.name)
          .map((student) => ({
            name: student.name,
            target: student.selectedCareer || 'Not selected',
          }))
      : [];

    const uniqueByName = Array.from(
      new Map(mappedFromRegistry.map((student) => [student.name, student])).values()
    );

    if (uniqueByName.length > 0) return uniqueByName;

    const savedName = (localStorage.getItem('studentName') || '').trim();
    if (!savedName) return [];

    return [{ name: savedName, target: 'Not selected' }];
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.name || '');
  const [roadmaps, setRoadmaps] = useState(() => {
    const publishedRoadmaps = parseJson(localStorage.getItem(STORAGE_KEY), {});
    const initial = {};
    students.forEach((student) => {
      initial[student.name] = publishedRoadmaps[student.name] || createDefaultRoadmap();
    });
    return initial;
  });
  const [publishMessage, setPublishMessage] = useState('');

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => student.name.toLowerCase().includes(query));
  }, [searchQuery, students]);

  const selectedRoadmap = roadmaps[selectedStudent];

  const handlePhaseChange = (index, field, value) => {
    setRoadmaps((prev) => {
      const phases = [...prev[selectedStudent].phases];
      phases[index] = { ...phases[index], [field]: value };
      return {
        ...prev,
        [selectedStudent]: {
          ...prev[selectedStudent],
          phases,
        },
      };
    });
  };

  const addPhase = () => {
    setRoadmaps((prev) => ({
      ...prev,
      [selectedStudent]: {
        ...prev[selectedStudent],
        phases: [
          ...prev[selectedStudent].phases,
          {
            title: `Phase ${prev[selectedStudent].phases.length + 1}`,
            description: '',
            status: 'pending',
          },
        ],
      },
    }));
  };

  const publishRoadmap = () => {
    if (!selectedStudent || !selectedRoadmap) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    const publishedRoadmaps = raw ? JSON.parse(raw) : {};

    publishedRoadmaps[selectedStudent] = {
      ...selectedRoadmap,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(publishedRoadmaps));
    setPublishMessage(`Roadmap published for ${selectedStudent}.`);
  };

  return (
    <div>
      <h2 className="mb-6">Student Roadmaps</h2>
      <p className="text-secondary mb-6">Create and provide personalized career roadmaps for individual students.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <h3 className="mb-4">Select Student</h3>
            <div className="flex items-center gap-2 mb-4" style={{ background: '#f4f5f7', padding: '0.5rem', borderRadius: '8px' }}>
              <Search className="text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              {!filteredStudents.length && (
                <p className="text-secondary text-sm">No students found in User Management.</p>
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
                      padding: '0.75rem',
                      background: isSelected ? 'rgba(0,82,204,0.1)' : 'white',
                      border: isSelected ? '1px solid var(--color-primary)' : '1px solid #dfe1e6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <strong>{student.name}</strong>
                    <p className="text-secondary text-sm">Target: {student.target}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            {!selectedStudent || !selectedRoadmap ? (
              <p className="text-secondary">Select a student to create and publish a roadmap.</p>
            ) : (
              <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <div style={{ padding: '0.5rem', background: '#f4f5f7', borderRadius: '8px' }}><Map className="text-primary"/></div>
                 <h3 style={{ margin: 0 }}>Roadmap: {selectedStudent}</h3>
              </div>
              <Button variant="accent" onClick={publishRoadmap}>Publish Updates</Button>
            </div>

            {publishMessage && (
              <p className="text-sm" style={{ color: '#28a745', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                {publishMessage}
              </p>
            )}

            <div style={{ borderLeft: '2px solid #dfe1e6', marginLeft: '1rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {selectedRoadmap.phases.map((phase, index) => {
                const isCompleted = phase.status === 'completed';
                return (
                  <div key={`${phase.title}-${index}`} style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-1.8rem',
                        top: '0.5rem',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: isCompleted ? 'var(--color-primary)' : '#dfe1e6',
                      }}
                    ></div>

                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => handlePhaseChange(index, 'title', e.target.value)}
                      placeholder={`Phase ${index + 1} title`}
                      style={{ marginBottom: '0.5rem', fontWeight: 600 }}
                    />

                    <input
                      type="text"
                      value={phase.description}
                      onChange={(e) => handlePhaseChange(index, 'description', e.target.value)}
                      placeholder="Add phase description"
                      style={{ marginBottom: '0.5rem' }}
                    />

                    <select
                      value={phase.status}
                      onChange={(e) => handlePhaseChange(index, 'status', e.target.value)}
                      style={{ maxWidth: '220px', marginBottom: '0.5rem' }}
                    >
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                );
              })}

              <div>
                <Button variant="primary" onClick={addPhase} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  + Add New Phase
                </Button>
              </div>

            </div>
            </>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminRoadmap;
