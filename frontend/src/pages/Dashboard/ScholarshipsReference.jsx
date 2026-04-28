import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import { Award, CalendarDays, ExternalLink, MapPin, Search } from 'lucide-react';

const STORAGE_KEY = 'guidance_plus_scholarships_reference';
const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

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

const normalizeStudentName = (name) => (name || '').trim();

const toList = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getNumericValue = (text) => {
  const match = String(text || '').replace(/,/g, '').match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : NaN;
};

const matchesCareerKeywords = (text, keywords) => {
  const normalizedText = String(text || '').toLowerCase();
  return keywords.some((keyword) => normalizedText.includes(keyword));
};

const ScholarshipsReference = () => {
  const studentName = normalizeStudentName(localStorage.getItem('studentName') || 'Student');

  const selectedCareer = useMemo(() => {
    const students = parseJson(localStorage.getItem(STUDENTS_KEY), []);
    const student = Array.isArray(students)
      ? students.find((item) => normalizeStudentName(item.name).toLowerCase() === studentName.toLowerCase())
      : null;

    return normalizeStudentName(student?.selectedCareer || '').toLowerCase();
  }, [studentName]);

  const scholarships = useMemo(() => {
    const stored = parseJson(localStorage.getItem(STORAGE_KEY), []);
    return Array.isArray(stored) && stored.length ? stored : createSampleScholarships();
  }, []);

  const [keywordFilter, setKeywordFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredScholarships = useMemo(() => {
    const keywordQuery = keywordFilter.trim().toLowerCase();
    const locationQuery = locationFilter.trim().toLowerCase();
    const statusQuery = statusFilter.trim().toLowerCase();
    const maxBudget = Number.parseInt(budgetFilter, 10);

    const careerKeywords = selectedCareer
      ? selectedCareer
          .split(' ')
          .map((item) => item.trim())
          .filter((item) => item.length > 2)
      : [];

    return scholarships.filter((item) => {
      const searchableText = `${item.name || ''} ${item.provider || ''} ${item.careerTags || ''} ${item.description || ''}`.toLowerCase();
      const location = String(item.location || '').toLowerCase();
      const status = String(item.status || '').toLowerCase();
      const amountValue = getNumericValue(item.amount);

      if (keywordQuery && !searchableText.includes(keywordQuery)) return false;
      if (locationQuery && !location.includes(locationQuery)) return false;
      if (statusQuery && !status.includes(statusQuery)) return false;
      if (!Number.isNaN(maxBudget) && maxBudget > 0 && !Number.isNaN(amountValue) && amountValue < maxBudget) return false;

      if (!careerKeywords.length) return true;

      return matchesCareerKeywords(`${item.careerTags || ''} ${item.name || ''} ${item.provider || ''}`, careerKeywords);
    });
  }, [budgetFilter, keywordFilter, locationFilter, scholarships, selectedCareer, statusFilter]);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      <h2 className="mb-2" style={{ fontSize: '2.25rem' }}>Scholarships Reference</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>
        Find scholarships and grants that match your career path, budget, and location preferences.
      </p>

      <Card className="mb-6" style={{ padding: '1.2rem' }}>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <Search size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Search scholarships"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', boxShadow: 'none' }}
            />
          </div>
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <MapPin size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', boxShadow: 'none' }}
            />
          </div>
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <Award size={16} className="text-secondary" />
            <input
              type="number"
              min="0"
              placeholder="Minimum amount"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', boxShadow: 'none' }}
            />
          </div>
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <CalendarDays size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Status (Open/Closed)"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', boxShadow: 'none' }}
            />
          </div>
        </div>

        {selectedCareer && (
          <p className="text-secondary" style={{ marginTop: '0.8rem', marginBottom: 0 }}>
            Showing career-based suggestions for: <strong>{selectedCareer}</strong>
          </p>
        )}
      </Card>

      {!filteredScholarships.length ? (
        <Card>
          <h3 className="mb-2">No matching scholarships found</h3>
          <p className="text-secondary">Try changing filters, or ask admin to publish more scholarship opportunities.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredScholarships.map((item) => (
            <Card key={item.id || `${item.name}-${item.provider}`} style={{ padding: '1.2rem' }}>
              <div className="flex justify-between items-start" style={{ gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{item.name || 'Scholarship'}</h3>
                  <p className="text-secondary" style={{ marginTop: '0.3rem', marginBottom: 0 }}>
                    <MapPin size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> {item.location || 'Location not provided'}
                  </p>
                </div>
                <span style={{ padding: '0.3rem 0.6rem', background: '#f4f5f7', borderRadius: '999px', fontSize: '0.85rem' }}>
                  {item.status || 'Open'}
                </span>
              </div>

              <div className="mt-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {toList(item.careerTags).map((tag) => (
                  <span key={tag} style={{ padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(0,82,204,0.08)', color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-secondary" style={{ fontSize: '0.95rem' }}>
                <p className="mb-1"><strong>Provider:</strong> {item.provider || 'Not provided'}</p>
                <p className="mb-1"><strong>Benefit:</strong> {item.amount || 'Not provided'}</p>
                <p className="mb-1"><strong>Deadline:</strong> {item.deadline || 'Not provided'}</p>
                <p className="mb-1"><strong>Eligibility:</strong> {item.eligibility || 'Not provided'}</p>
              </div>

              {item.description && <p className="text-secondary" style={{ marginTop: '0.5rem' }}>{item.description}</p>}

              {item.applyLink && (
                <a href={item.applyLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                  Apply Now <ExternalLink size={14} />
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScholarshipsReference;