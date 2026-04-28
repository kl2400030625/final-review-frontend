import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Briefcase, CalendarDays, ExternalLink, Plus, Search, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'guidance_plus_internships_reference';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const createInternship = () => ({
  id: `internship-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  company: '',
  location: '',
  stipend: '',
  duration: '',
  deadline: '',
  eligibility: '',
  applyLink: '',
  careerTags: '',
  description: '',
  mode: 'Hybrid',
  status: 'Open',
});

const createSampleInternships = () => ([
  {
    id: 'internship-sample-1',
    title: 'Software Engineering Intern',
    company: 'NextWave Labs',
    location: 'Bengaluru, India',
    stipend: 'INR 25,000/month',
    duration: '3 months',
    deadline: '2026-05-31',
    eligibility: 'Students in Computer Science, IT, or related fields.',
    applyLink: 'https://example.com/internships/software',
    careerTags: 'Software Engineer, Full Stack, Backend',
    description: 'Work on live product features with a mentor-led team.',
    mode: 'Hybrid',
    status: 'Open',
  },
  {
    id: 'internship-sample-2',
    title: 'Business Operations Intern',
    company: 'CareerBridge Group',
    location: 'Mumbai, India',
    stipend: 'INR 18,000/month',
    duration: '6 months',
    deadline: '2026-07-10',
    eligibility: 'Students interested in operations, strategy, or analytics.',
    applyLink: 'https://example.com/internships/operations',
    careerTags: 'Business Analyst, Operations, Finance',
    description: 'Learn how business teams plan, execute, and improve processes.',
    mode: 'Remote',
    status: 'Open',
  },
]);

const normalizeLink = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const normalizeInternship = (internship) => ({
  ...createInternship(),
  ...internship,
  id: internship.id || `internship-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: (internship.title || '').trim(),
  company: (internship.company || '').trim(),
  location: (internship.location || '').trim(),
  stipend: (internship.stipend || '').trim(),
  duration: (internship.duration || '').trim(),
  deadline: (internship.deadline || '').trim(),
  eligibility: (internship.eligibility || '').trim(),
  applyLink: normalizeLink(internship.applyLink),
  careerTags: (internship.careerTags || '').trim(),
  description: (internship.description || '').trim(),
  mode: (internship.mode || 'Hybrid').trim(),
  status: (internship.status || 'Open').trim(),
});

const AdminInternships = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [internships, setInternships] = useState(() => {
    const stored = parseJson(localStorage.getItem(STORAGE_KEY), []);
    if (!Array.isArray(stored) || !stored.length) return createSampleInternships();
    return stored.map(normalizeInternship);
  });
  const [message, setMessage] = useState('');

  const filteredInternships = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return internships;

    return internships.filter((item) => {
      return [item.title, item.company, item.location, item.stipend, item.duration, item.careerTags, item.description, item.mode, item.status]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [internships, searchQuery]);

  const updateInternship = (id, field, value) => {
    setInternships((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addInternship = () => {
    setInternships((prev) => [...prev, createInternship()]);
    setMessage('');
  };

  const removeInternship = (id) => {
    setInternships((prev) => {
      const remaining = prev.filter((item) => item.id !== id);
      return remaining.length ? remaining : [createInternship()];
    });
    setMessage('');
  };

  const saveInternships = () => {
    const normalized = internships
      .map(normalizeInternship)
      .filter((item) => item.title && item.company && item.stipend);

    if (!normalized.length) {
      setMessage('Please add at least one complete internship entry (title, company, stipend).');
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setInternships(normalized);
    setMessage(`Saved ${normalized.length} internship entr${normalized.length === 1 ? 'y' : 'ies'}.`);
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      <h2 className="mb-2" style={{ fontSize: '2.3rem' }}>Internships Reference</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>
        Publish internship opportunities with stipends, deadlines, eligibility, and application links.
      </p>

      <div className="flex justify-between items-center mb-4" style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <div className="flex items-center gap-3" style={{ background: '#f4f5f7', padding: '0.85rem 1rem', borderRadius: '12px', minWidth: '320px', flex: '1 1 480px' }}>
          <Search className="text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search by internship, company, location, or career..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem', boxShadow: 'none' }}
          />
        </div>
        <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={addInternship}><Plus size={16} className="mr-2" /> Add Internship</Button>
          <Button variant="accent" onClick={saveInternships}>Save & Publish</Button>
        </div>
      </div>

      {message && (
        <p className="text-sm" style={{ color: message.startsWith('Please') ? 'var(--color-accent)' : '#28a745', marginBottom: '1rem' }}>{message}</p>
      )}

      <div className="flex flex-col gap-4">
        {filteredInternships.map((item, index) => (
          <Card key={item.id} style={{ padding: '1.2rem' }}>
            <div className="flex justify-between items-center mb-3" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary" size={20} />
                <h3 style={{ margin: 0 }}>Opportunity {index + 1}</h3>
              </div>
              <Button variant="ghost" onClick={() => removeInternship(item.id)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
                <Trash2 size={16} className="mr-2" /> Remove
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="Internship Title / Role" value={item.title} onChange={(e) => updateInternship(item.id, 'title', e.target.value)} />
              <input type="text" placeholder="Company / Organization" value={item.company} onChange={(e) => updateInternship(item.id, 'company', e.target.value)} />
              <input type="text" placeholder="Location" value={item.location} onChange={(e) => updateInternship(item.id, 'location', e.target.value)} />
              <input type="text" placeholder="Stipend (e.g. INR 20,000/month or Unpaid)" value={item.stipend} onChange={(e) => updateInternship(item.id, 'stipend', e.target.value)} />
              <input type="text" placeholder="Duration (e.g. 3 months)" value={item.duration} onChange={(e) => updateInternship(item.id, 'duration', e.target.value)} />
              <input type="text" placeholder="Mode (Remote, On-site, Hybrid)" value={item.mode} onChange={(e) => updateInternship(item.id, 'mode', e.target.value)} />
              <input type="date" placeholder="Deadline" value={item.deadline} onChange={(e) => updateInternship(item.id, 'deadline', e.target.value)} />
              <input type="text" placeholder="Status (Open, Upcoming, Closed)" value={item.status} onChange={(e) => updateInternship(item.id, 'status', e.target.value)} />
              <input type="text" placeholder="Career Tags (Engineering, Design, Marketing...)" value={item.careerTags} onChange={(e) => updateInternship(item.id, 'careerTags', e.target.value)} />
              <input type="url" placeholder="Application Link" value={item.applyLink} onChange={(e) => updateInternship(item.id, 'applyLink', e.target.value)} />
              <textarea
                className="md:col-span-2"
                rows="3"
                placeholder="Eligibility criteria and notes"
                value={item.eligibility}
                onChange={(e) => updateInternship(item.id, 'eligibility', e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
              <textarea
                className="md:col-span-2"
                rows="3"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateInternship(item.id, 'description', e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminInternships;