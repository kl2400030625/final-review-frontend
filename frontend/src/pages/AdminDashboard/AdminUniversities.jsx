import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { GraduationCap, Plus, Search, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'guidance_plus_colleges_reference';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const createCollege = () => ({
  id: `college-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  location: '',
  courses: '',
  fees: '',
  rating: '4.0',
  entranceExams: '',
  eligibility: '',
  website: '',
  careerTags: '',
});

const normalizeWebsite = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const normalizeCollege = (college) => ({
  ...createCollege(),
  ...college,
  id: college.id || `college-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: (college.name || '').trim(),
  location: (college.location || '').trim(),
  courses: (college.courses || '').trim(),
  fees: (college.fees || '').trim(),
  rating: String(college.rating || '4.0').trim(),
  entranceExams: (college.entranceExams || '').trim(),
  eligibility: (college.eligibility || '').trim(),
  website: normalizeWebsite(college.website),
  careerTags: (college.careerTags || '').trim(),
});

const AdminUniversities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState(() => {
    const stored = parseJson(localStorage.getItem(STORAGE_KEY), []);
    if (!Array.isArray(stored) || !stored.length) return [createCollege()];
    return stored.map(normalizeCollege);
  });
  const [message, setMessage] = useState('');

  const filteredColleges = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return colleges;

    return colleges.filter((college) => {
      return [
        college.name,
        college.location,
        college.courses,
        college.entranceExams,
        college.careerTags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [searchQuery, colleges]);

  const updateCollege = (id, field, value) => {
    setColleges((prev) => prev.map((college) => (college.id === id ? { ...college, [field]: value } : college)));
  };

  const addCollege = () => {
    setColleges((prev) => [...prev, createCollege()]);
    setMessage('');
  };

  const removeCollege = (id) => {
    setColleges((prev) => {
      const remaining = prev.filter((college) => college.id !== id);
      return remaining.length ? remaining : [createCollege()];
    });
    setMessage('');
  };

  const saveColleges = () => {
    const normalized = colleges
      .map(normalizeCollege)
      .filter((college) => college.name && college.location && college.courses);

    if (!normalized.length) {
      setMessage('Please add at least one complete college entry (name, location, courses).');
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setColleges(normalized);
    setMessage(`Saved ${normalized.length} college reference entr${normalized.length === 1 ? 'y' : 'ies'}.`);
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      <h2 className="mb-2" style={{ fontSize: '2.3rem' }}>Universities & Colleges Reference</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>
        Create institution references with courses, fees, ratings, eligibility, entrance exams, and official links.
      </p>

      <div className="flex justify-between items-center mb-4" style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <div className="flex items-center gap-3" style={{ background: '#f4f5f7', padding: '0.85rem 1rem', borderRadius: '12px', minWidth: '320px', flex: '1 1 480px' }}>
          <Search className="text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search by college, location, course, exam, career..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem', boxShadow: 'none' }}
          />
        </div>
        <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={addCollege}><Plus size={16} className="mr-2" /> Add College</Button>
          <Button variant="accent" onClick={saveColleges}>Save & Publish</Button>
        </div>
      </div>

      {message && (
        <p className="text-sm" style={{ color: message.startsWith('Please') ? 'var(--color-accent)' : '#28a745', marginBottom: '1rem' }}>{message}</p>
      )}

      <div className="flex flex-col gap-4">
        {filteredColleges.map((college, index) => (
          <Card key={college.id} style={{ padding: '1.2rem' }}>
            <div className="flex justify-between items-center mb-3" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div className="flex items-center gap-2">
                <GraduationCap className="text-primary" size={20} />
                <h3 style={{ margin: 0 }}>Institution {index + 1}</h3>
              </div>
              <Button variant="ghost" onClick={() => removeCollege(college.id)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
                <Trash2 size={16} className="mr-2" /> Remove
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="College Name" value={college.name} onChange={(e) => updateCollege(college.id, 'name', e.target.value)} />
              <input type="text" placeholder="Location (City, State)" value={college.location} onChange={(e) => updateCollege(college.id, 'location', e.target.value)} />
              <input type="text" placeholder="Courses Offered (comma separated)" value={college.courses} onChange={(e) => updateCollege(college.id, 'courses', e.target.value)} />
              <input type="text" placeholder="Approximate Fees (e.g. 120000 per year)" value={college.fees} onChange={(e) => updateCollege(college.id, 'fees', e.target.value)} />
              <input type="text" placeholder="Rating (e.g. 4.2)" value={college.rating} onChange={(e) => updateCollege(college.id, 'rating', e.target.value)} />
              <input type="text" placeholder="Entrance Exams (JEE, NEET, CET...)" value={college.entranceExams} onChange={(e) => updateCollege(college.id, 'entranceExams', e.target.value)} />
              <input type="text" placeholder="Career Tags (Software Engineer, Doctor...)" value={college.careerTags} onChange={(e) => updateCollege(college.id, 'careerTags', e.target.value)} />
              <input type="url" placeholder="Official Website" value={college.website} onChange={(e) => updateCollege(college.id, 'website', e.target.value)} />
              <textarea
                className="md:col-span-2"
                rows="3"
                placeholder="Eligibility Criteria"
                value={college.eligibility}
                onChange={(e) => updateCollege(college.id, 'eligibility', e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUniversities;
