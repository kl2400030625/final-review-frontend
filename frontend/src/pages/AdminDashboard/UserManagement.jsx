import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, Edit, Trash2 } from 'lucide-react';

const STUDENTS_KEY = 'guidance_plus_students';
const RESUME_KEY = 'resumeSubmissions';

const studentScopedObjectKeys = [
  'publishedRoadmaps',
  'publishedStudyPlans',
  'publishedResources',
  'publishedWorkshops',
  'publishedWebinars',
  'publishedMockInterviews',
  'publishedCodingContests',
];

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
    status: student.status || 'Active',
    selectedCareer: student.selectedCareer || 'Not selected',
    codingPerformance: student.codingPerformance ?? '',
    counselorName: student.counselorName || '',
    counselorDesignation: student.counselorDesignation || '',
    counselorPhone: student.counselorPhone || '',
    counselorEmail: student.counselorEmail || '',
    counselorNotes: student.counselorNotes || '',
    lastLoginAt: student.lastLoginAt || null,
  }));
};

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState('');

  const [draft, setDraft] = useState({
    name: '',
    email: '',
    status: 'Active',
    selectedCareer: '',
    codingPerformance: '',
    counselorName: '',
    counselorDesignation: '',
    counselorPhone: '',
    counselorEmail: '',
    counselorNotes: '',
  });

  useEffect(() => {
    const stored = parseJson(localStorage.getItem(STUDENTS_KEY), []);
    const normalized = normalizeStudents(stored);
    setStudents(normalized);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(normalized));
  }, []);

  const resumeSubmissions = useMemo(() => parseJson(localStorage.getItem(RESUME_KEY), []), [students]);

  const persistStudents = (nextStudents) => {
    setStudents(nextStudents);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(nextStudents));
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(query) ||
        (student.email || '').toLowerCase().includes(query) ||
        (student.selectedCareer || '').toLowerCase().includes(query)
      );
    });
  }, [students, searchQuery]);

  const getResumeAvailability = (studentName) => {
    const count = resumeSubmissions.filter((item) => item.studentName === studentName).length;
    return count > 0 ? `Yes (${count})` : 'No';
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId('');
    setDraft({
      name: '',
      email: '',
      status: 'Active',
      selectedCareer: '',
      codingPerformance: '',
      counselorName: '',
      counselorDesignation: '',
      counselorPhone: '',
      counselorEmail: '',
      counselorNotes: '',
    });
  };

  const startEdit = (student) => {
    setIsAdding(false);
    setEditingId(student.id);
    setDraft({
      name: student.name,
      email: student.email,
      status: student.status,
      selectedCareer: student.selectedCareer === 'Not selected' ? '' : student.selectedCareer,
      codingPerformance: student.codingPerformance,
      counselorName: student.counselorName || '',
      counselorDesignation: student.counselorDesignation || '',
      counselorPhone: student.counselorPhone || '',
      counselorEmail: student.counselorEmail || '',
      counselorNotes: student.counselorNotes || '',
    });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId('');
    setDraft({
      name: '',
      email: '',
      status: 'Active',
      selectedCareer: '',
      codingPerformance: '',
      counselorName: '',
      counselorDesignation: '',
      counselorPhone: '',
      counselorEmail: '',
      counselorNotes: '',
    });
  };

  const saveNewStudent = () => {
    const name = draft.name.trim();
    if (!name) return;

    const email = draft.email.trim().toLowerCase();
    const id = email || `name:${name.toLowerCase()}`;

    const exists = students.some((student) => student.id === id);
    if (exists) {
      alert('Student with same email/name already exists.');
      return;
    }

    const newStudent = {
      id,
      name,
      email,
      status: draft.status || 'Active',
      selectedCareer: draft.selectedCareer.trim() || 'Not selected',
      codingPerformance: draft.codingPerformance,
      counselorName: draft.counselorName.trim(),
      counselorDesignation: draft.counselorDesignation.trim(),
      counselorPhone: draft.counselorPhone.trim(),
      counselorEmail: draft.counselorEmail.trim(),
      counselorNotes: draft.counselorNotes.trim(),
      lastLoginAt: null,
    };

    persistStudents([newStudent, ...students]);
    cancelEdit();
  };

  const saveEdit = () => {
    const name = draft.name.trim();
    if (!name || !editingId) return;

    const nextStudents = students.map((student) => {
      if (student.id !== editingId) return student;
      return {
        ...student,
        name,
        email: draft.email.trim().toLowerCase(),
        status: draft.status || 'Active',
        selectedCareer: draft.selectedCareer.trim() || 'Not selected',
        codingPerformance: draft.codingPerformance,
        counselorName: draft.counselorName.trim(),
        counselorDesignation: draft.counselorDesignation.trim(),
        counselorPhone: draft.counselorPhone.trim(),
        counselorEmail: draft.counselorEmail.trim(),
        counselorNotes: draft.counselorNotes.trim(),
      };
    });

    persistStudents(nextStudents);
    cancelEdit();
  };

  const deleteStudent = (student) => {
    const confirmed = window.confirm(`Delete account for ${student.name}?`);
    if (!confirmed) return;

    const nextStudents = students.filter((item) => item.id !== student.id);
    persistStudents(nextStudents);

    // Remove student-linked entries from all per-student published objects.
    studentScopedObjectKeys.forEach((key) => {
      const value = parseJson(localStorage.getItem(key), {});
      if (value && typeof value === 'object') {
        delete value[student.name];
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    // Remove student submissions.
    const resumeSubmissionsRaw = parseJson(localStorage.getItem('resumeSubmissions'), []);
    localStorage.setItem(
      'resumeSubmissions',
      JSON.stringify(resumeSubmissionsRaw.filter((item) => item.studentName !== student.name))
    );

    const assessmentSubmissionsRaw = parseJson(localStorage.getItem('assessmentSubmissions'), []);
    localStorage.setItem(
      'assessmentSubmissions',
      JSON.stringify(assessmentSubmissionsRaw.filter((item) => item.studentName !== student.name))
    );
  };

  const isEditingRow = (studentId) => editingId === studentId;

  const formatCounselorSummary = (student) => {
    const parts = [
      student.counselorName,
      student.counselorDesignation,
      student.counselorPhone,
      student.counselorEmail,
    ].filter(Boolean);
    return parts.length ? parts.join(' | ') : 'Not assigned';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>User Management</h2>
        <Button variant="accent" onClick={startAdd}>+ Add Student</Button>
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-6" style={{ background: '#f4f5f7', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <Search className="text-secondary" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, email, or career..."
            style={{ border: 'none', background: 'transparent', width: '100%' }}
          />
        </div>

        {isAdding && (
          <div style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: '#f8fafc' }}>
            <h3 className="mb-3">Add New Student</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <input type="email" placeholder="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input type="text" placeholder="Selected Career" value={draft.selectedCareer} onChange={(e) => setDraft({ ...draft, selectedCareer: e.target.value })} />
              <input type="text" placeholder="Coding Performance (e.g. 82%)" value={draft.codingPerformance} onChange={(e) => setDraft({ ...draft, codingPerformance: e.target.value })} />
              <input type="text" placeholder="Counselor Name" value={draft.counselorName} onChange={(e) => setDraft({ ...draft, counselorName: e.target.value })} />
              <input type="text" placeholder="Counselor Designation" value={draft.counselorDesignation} onChange={(e) => setDraft({ ...draft, counselorDesignation: e.target.value })} />
              <input type="text" placeholder="Counselor Phone" value={draft.counselorPhone} onChange={(e) => setDraft({ ...draft, counselorPhone: e.target.value })} />
              <input type="email" placeholder="Counselor Email" value={draft.counselorEmail} onChange={(e) => setDraft({ ...draft, counselorEmail: e.target.value })} />
              <textarea
                className="md:col-span-2"
                rows="3"
                placeholder="Counselor Notes"
                value={draft.counselorNotes}
                onChange={(e) => setDraft({ ...draft, counselorNotes: e.target.value })}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
            <div className="mt-3" style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="primary" onClick={saveNewStudent}>Save Student</Button>
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            </div>
          </div>
        )}

        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #dfe1e6' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Selected Career</th>
              <th style={{ padding: '1rem' }}>Resume Available</th>
              <th style={{ padding: '1rem' }}>Coding Performance</th>
              <th style={{ padding: '1rem' }}>Counselor Details</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const editing = isEditingRow(student.id);
              return (
                <tr key={student.id} style={{ borderBottom: '1px solid #dfe1e6' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    {editing ? (
                      <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {editing ? (
                      <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                    ) : (
                      student.email || '-'
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {editing ? (
                      <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    ) : (
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: student.status === 'Active' ? '#28a745' : '#6c757d',
                        background: student.status === 'Active' ? 'rgba(40,167,69,0.1)' : '#f1f3f5',
                      }}>
                        {student.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {editing ? (
                      <input value={draft.selectedCareer} onChange={(e) => setDraft({ ...draft, selectedCareer: e.target.value })} />
                    ) : (
                      student.selectedCareer
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>{getResumeAvailability(student.name)}</td>
                  <td style={{ padding: '1rem' }}>
                    {editing ? (
                      <input value={draft.codingPerformance} onChange={(e) => setDraft({ ...draft, codingPerformance: e.target.value })} />
                    ) : (
                      student.codingPerformance || 'N/A'
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', maxWidth: '260px' }}>
                    {editing ? (
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <input value={draft.counselorName} onChange={(e) => setDraft({ ...draft, counselorName: e.target.value })} placeholder="Counselor Name" />
                        <input value={draft.counselorDesignation} onChange={(e) => setDraft({ ...draft, counselorDesignation: e.target.value })} placeholder="Designation" />
                        <input value={draft.counselorPhone} onChange={(e) => setDraft({ ...draft, counselorPhone: e.target.value })} placeholder="Phone" />
                        <input value={draft.counselorEmail} onChange={(e) => setDraft({ ...draft, counselorEmail: e.target.value })} placeholder="Email" />
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '0.2rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{student.counselorName || 'Not assigned'}</strong>
                        <span>{student.counselorDesignation || ''}</span>
                        <span>{student.counselorPhone || ''}</span>
                        <span>{student.counselorEmail || ''}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {editing ? (
                      <>
                        <Button variant="primary" onClick={saveEdit} style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}>Save</Button>
                        <Button variant="outline" onClick={cancelEdit} style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(student)}
                          style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteStudent(student)}
                          style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc3545' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {!filteredStudents.length && (
              <tr>
                <td colSpan={8} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default UserManagement;
