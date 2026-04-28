import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Edit2, Trash2, Save, X } from 'lucide-react';

const QUESTION_BANK_KEY = 'guidance_plus_questions_master';
const SUBMISSIONS_KEY = 'assessmentSubmissions';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const AssessmentManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editQ, setEditQ] = useState('');
  const [editOpt1, setEditOpt1] = useState('');
  const [editOpt2, setEditOpt2] = useState('');
  const [editOpt3, setEditOpt3] = useState('');
  const [editOpt4, setEditOpt4] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem(QUESTION_BANK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
      } else {
        setQuestions([]);
      }
    } else {
      setQuestions([]);
    }

    const storedSubmissions = parseJson(localStorage.getItem(SUBMISSIONS_KEY), []);
    const sortedSubmissions = [...storedSubmissions].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    setSubmissions(sortedSubmissions);
  }, []);

  const refreshSubmissions = () => {
    const storedSubmissions = parseJson(localStorage.getItem(SUBMISSIONS_KEY), []);
    const sortedSubmissions = [...storedSubmissions].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    setSubmissions(sortedSubmissions);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    const updated = [...questions, { q: newQ, options: [opt1, opt2, opt3, opt4] }];
    setQuestions(updated);
    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(updated));
    setNewQ(''); setOpt1(''); setOpt2(''); setOpt3(''); setOpt4('');
  };

  const startEdit = (index) => {
    const item = questions[index];
    setEditingIndex(index);
    setEditQ(item.q || '');
    setEditOpt1(item.options?.[0] || '');
    setEditOpt2(item.options?.[1] || '');
    setEditOpt3(item.options?.[2] || '');
    setEditOpt4(item.options?.[3] || '');
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditQ('');
    setEditOpt1('');
    setEditOpt2('');
    setEditOpt3('');
    setEditOpt4('');
  };

  const saveEdit = (index) => {
    if (!editQ.trim() || !editOpt1.trim() || !editOpt2.trim() || !editOpt3.trim() || !editOpt4.trim()) {
      return;
    }

    const updated = [...questions];
    updated[index] = {
      q: editQ.trim(),
      options: [editOpt1.trim(), editOpt2.trim(), editOpt3.trim(), editOpt4.trim()],
    };

    setQuestions(updated);
    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(updated));
    cancelEdit();
  };

  const deleteQuestion = (index) => {
    const confirmed = window.confirm(`Delete question ${index + 1}?`);
    if (!confirmed) return;

    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(updated));

    if (editingIndex === index) {
      cancelEdit();
    }
  };

  const studentNames = Array.from(
    new Set(submissions.map((item) => item.studentName).filter(Boolean))
  );

  const filteredSubmissions = submissions.filter((submission) => {
    if (selectedStudentFilter === 'all') return true;
    return submission.studentName === selectedStudentFilter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Assessment Management</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="mb-4">Create New Question</h3>
          <form onSubmit={handleAddQuestion}>
            <div className="mb-4">
              <label>Question Text</label>
              <input type="text" value={newQ} onChange={e => setNewQ(e.target.value)} required />
            </div>
            <div className="mb-2"><label>Option 1</label><input type="text" value={opt1} onChange={e => setOpt1(e.target.value)} required /></div>
            <div className="mb-2"><label>Option 2</label><input type="text" value={opt2} onChange={e => setOpt2(e.target.value)} required /></div>
            <div className="mb-2"><label>Option 3</label><input type="text" value={opt3} onChange={e => setOpt3(e.target.value)} required /></div>
            <div className="mb-6"><label>Option 4</label><input type="text" value={opt4} onChange={e => setOpt4(e.target.value)} required /></div>
            <Button type="submit" variant="primary" style={{ width: '100%' }}>Publish Question</Button>
          </form>
        </Card>

        <Card>
          <h3 className="mb-4">Live Assessment Database ({questions.length} total)</h3>
          {!questions.length && (
            <p className="text-secondary mb-4">No questions published yet. Add a question to make it available for all students.</p>
          )}
          <div style={{ height: '500px', overflowY: 'auto' }}>
            {questions.map((qItem, idx) => (
              <div key={idx} style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                {editingIndex === idx ? (
                  <>
                    <div className="mb-2">
                      <label>Question</label>
                      <input type="text" value={editQ} onChange={(e) => setEditQ(e.target.value)} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      <input type="text" value={editOpt1} onChange={(e) => setEditOpt1(e.target.value)} placeholder="Option 1" />
                      <input type="text" value={editOpt2} onChange={(e) => setEditOpt2(e.target.value)} placeholder="Option 2" />
                      <input type="text" value={editOpt3} onChange={(e) => setEditOpt3(e.target.value)} placeholder="Option 3" />
                      <input type="text" value={editOpt4} onChange={(e) => setEditOpt4(e.target.value)} placeholder="Option 4" />
                    </div>
                    <div className="mt-3" style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="primary" onClick={() => saveEdit(idx)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}>
                        <Save size={14} style={{ marginRight: '0.35rem' }} /> Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} style={{ padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}>
                        <X size={14} style={{ marginRight: '0.35rem' }} /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start" style={{ gap: '0.75rem' }}>
                      <h4 style={{ marginBottom: '0.5rem' }}>Q{idx + 1}: {qItem.q}</h4>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => startEdit(idx)}
                          style={{ padding: '0.35rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                          aria-label={`Edit question ${idx + 1}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteQuestion(idx)}
                          style={{ padding: '0.35rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc3545' }}
                          aria-label={`Delete question ${idx + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      {(qItem.options || []).map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex justify-between items-center mb-4" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Student Submitted Answers</h3>
          <div className="flex items-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              <option value="all">All Students</option>
              {studentNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <Button variant="outline" onClick={refreshSubmissions}>Refresh</Button>
          </div>
        </div>

        {!filteredSubmissions.length ? (
          <p className="text-secondary">No submitted answers found yet.</p>
        ) : (
          <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
            {filteredSubmissions.map((submission) => (
              <div key={submission.id || `${submission.studentName}-${submission.submittedAt}`} style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <div className="flex justify-between items-center mb-2" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h4 style={{ margin: 0 }}>{submission.studentName || 'Unknown Student'}</h4>
                  <span className="text-secondary text-sm">
                    {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown time'}
                  </span>
                </div>

                <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                  {Object.keys(submission.answers || {})
                    .map((key) => parseInt(key, 10))
                    .filter((idx) => Number.isInteger(idx) && idx > 0)
                    .sort((a, b) => a - b)
                    .map((questionNumber) => {
                      const questionIndex = questionNumber - 1;
                      const questionBank = Array.isArray(submission.questionSnapshot) && submission.questionSnapshot.length
                        ? submission.questionSnapshot
                        : questions;

                      const question = questionBank[questionIndex];
                      const answerIndexRaw = submission.answers?.[questionNumber] ?? submission.answers?.[String(questionNumber)];
                      const answerIndex = typeof answerIndexRaw === 'string' ? parseInt(answerIndexRaw, 10) : answerIndexRaw;
                      const selectedOption = Number.isInteger(answerIndex) && question?.options?.[answerIndex]
                        ? question.options[answerIndex]
                        : `Option ${Number.isInteger(answerIndex) ? answerIndex + 1 : ''}`.trim();

                      return (
                        <div key={`${submission.id || submission.studentName}-${questionNumber}`} style={{ background: '#f8fafc', border: '1px solid #e7e9ee', borderRadius: '8px', padding: '0.75rem' }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>
                            Q{questionNumber}: {question?.q || 'Question text unavailable'}
                          </div>
                          <div className="text-secondary" style={{ fontSize: '0.92rem' }}>
                            Selected: {selectedOption || 'No answer selected'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
export default AssessmentManagement;