import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Award, CalendarDays, ExternalLink, Plus, Search, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'guidance_plus_scholarships_reference';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const createScholarship = () => ({
  id: `scholarship-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  provider: '',
  location: '',
  amount: '',
  deadline: '',
  eligibility: '',
  applyLink: '',
  careerTags: '',
  description: '',
  status: 'Open',
});

const createSampleScholarships = () => ([
  {
    id: 'scholarship-sample-1',
    name: 'Guidance Plus Merit Scholarship',
    provider: 'Guidance Plus Foundation',
    location: 'India',
    amount: 'INR 50,000',
    deadline: '2026-06-30',
    eligibility: 'Students with strong academic performance and a clear career goal.',
    applyLink: 'https://example.com/scholarships/merit',
    careerTags: 'Engineering, Computer Science, Commerce',
    description: 'Merit-based scholarship for students preparing for higher education.',
    status: 'Open',
  },
  {
    id: 'scholarship-sample-2',
    name: 'Future Leaders Scholarship',
    provider: 'Career Growth Trust',
    location: 'Global',
    amount: 'Full Tuition',
    deadline: '2026-08-15',
    eligibility: 'Students demonstrating leadership, community impact, and financial need.',
    applyLink: 'https://example.com/scholarships/leaders',
    careerTags: 'Management, Finance, Law',
    description: 'Supports students who want to build leadership careers.',
    status: 'Open',
  },
]);

const normalizeLink = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const normalizeScholarship = (scholarship) => ({
  ...createScholarship(),
  ...scholarship,
  id: scholarship.id || `scholarship-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: (scholarship.name || '').trim(),
  provider: (scholarship.provider || '').trim(),
  location: (scholarship.location || '').trim(),
  amount: (scholarship.amount || '').trim(),
  deadline: (scholarship.deadline || '').trim(),
  eligibility: (scholarship.eligibility || '').trim(),
  applyLink: normalizeLink(scholarship.applyLink),
  careerTags: (scholarship.careerTags || '').trim(),
  description: (scholarship.description || '').trim(),
  status: (scholarship.status || 'Open').trim(),
});

const AdminScholarships = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState(() => {
    const stored = parseJson(localStorage.getItem(STORAGE_KEY), []);
    if (!Array.isArray(stored) || !stored.length) return createSampleScholarships();
    return stored.map(normalizeScholarship);
  });
  const [message, setMessage] = useState('');

  const filteredScholarships = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return scholarships;

    return scholarships.filter((item) => {
      return [item.name, item.provider, item.location, item.amount, item.careerTags, item.description, item.status]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [searchQuery, scholarships]);

  const updateScholarship = (id, field, value) => {
    setScholarships((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addScholarship = () => {
    setScholarships((prev) => [...prev, createScholarship()]);
    setMessage('');
  };

  const removeScholarship = (id) => {
    setScholarships((prev) => {
      const remaining = prev.filter((item) => item.id !== id);
      return remaining.length ? remaining : [createScholarship()];
    });
    setMessage('');
  };

  const saveScholarships = () => {
    const normalized = scholarships
      .map(normalizeScholarship)
      .filter((item) => item.name && item.provider && item.amount);

    if (!normalized.length) {
      setMessage('Please add at least one complete scholarship entry (name, provider, amount).');
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setScholarships(normalized);
    setMessage(`Saved ${normalized.length} scholarship entr${normalized.length === 1 ? 'y' : 'ies'}.`);
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      <h2 className="mb-2" style={{ fontSize: '2.3rem' }}>Scholarships Reference</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>
        Add funding opportunities with amount, deadlines, eligibility, and official application links.
      </p>

      <div className="flex justify-between items-center mb-4" style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <div className="flex items-center gap-3" style={{ background: '#f4f5f7', padding: '0.85rem 1rem', borderRadius: '12px', minWidth: '320px', flex: '1 1 480px' }}>
          <Search className="text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search by scholarship, provider, location, or career..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem', boxShadow: 'none' }}
          />
        </div>
        <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={addScholarship}><Plus size={16} className="mr-2" /> Add Scholarship</Button>
          <Button variant="accent" onClick={saveScholarships}>Save & Publish</Button>
        </div>
      </div>

      {message && (
        <p className="text-sm" style={{ color: message.startsWith('Please') ? 'var(--color-accent)' : '#28a745', marginBottom: '1rem' }}>{message}</p>
      )}

      <div className="flex flex-col gap-4">
        {filteredScholarships.map((item, index) => (
          <Card key={item.id} style={{ padding: '1.2rem' }}>
            <div className="flex justify-between items-center mb-3" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div className="flex items-center gap-2">
                <Award className="text-primary" size={20} />
                <h3 style={{ margin: 0 }}>Opportunity {index + 1}</h3>
              </div>
              <Button variant="ghost" onClick={() => removeScholarship(item.id)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}>
                <Trash2 size={16} className="mr-2" /> Remove
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="Scholarship Name" value={item.name} onChange={(e) => updateScholarship(item.id, 'name', e.target.value)} />
              <input type="text" placeholder="Provider / Organization" value={item.provider} onChange={(e) => updateScholarship(item.id, 'provider', e.target.value)} />
              <input type="text" placeholder="Location / Eligibility Region" value={item.location} onChange={(e) => updateScholarship(item.id, 'location', e.target.value)} />
              <input type="text" placeholder="Amount / Benefit (e.g. INR 50,000 or Full Tuition)" value={item.amount} onChange={(e) => updateScholarship(item.id, 'amount', e.target.value)} />
              <input type="date" placeholder="Deadline" value={item.deadline} onChange={(e) => updateScholarship(item.id, 'deadline', e.target.value)} />
              <input type="text" placeholder="Status (Open, Upcoming, Closed)" value={item.status} onChange={(e) => updateScholarship(item.id, 'status', e.target.value)} />
              <input type="text" placeholder="Career Tags (Engineering, Medicine, Finance...)" value={item.careerTags} onChange={(e) => updateScholarship(item.id, 'careerTags', e.target.value)} />
              <input type="url" placeholder="Application Link" value={item.applyLink} onChange={(e) => updateScholarship(item.id, 'applyLink', e.target.value)} />
              <textarea
                className="md:col-span-2"
                rows="3"
                placeholder="Eligibility criteria and notes"
                value={item.eligibility}
                onChange={(e) => updateScholarship(item.id, 'eligibility', e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
              <textarea
                className="md:col-span-2"
                rows="3"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateScholarship(item.id, 'description', e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminScholarships;