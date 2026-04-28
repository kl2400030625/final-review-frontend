import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import { Briefcase, CalendarDays, ExternalLink, MapPin, Search } from 'lucide-react';

const STORAGE_KEY = 'guidance_plus_internships_reference';
const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

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

const InternshipsReference = () => {
  const studentName = normalizeStudentName(localStorage.getItem('studentName') || 'Student');

  const selectedCareer = useMemo(() => {
    const students = parseJson(localStorage.getItem(STUDENTS_KEY), []);
    const student = Array.isArray(students)
      ? students.find((item) => normalizeStudentName(item.name).toLowerCase() === studentName.toLowerCase())
      : null;

    return normalizeStudentName(student?.selectedCareer || '').toLowerCase();
  }, [studentName]);

  const internships = useMemo(() => {
    const stored = parseJson(localStorage.getItem(STORAGE_KEY), []);
    return Array.isArray(stored) && stored.length ? stored : createSampleInternships();
  }, []);

  const [keywordFilter, setKeywordFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [stipendFilter, setStipendFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  const filteredInternships = useMemo(() => {
    const keywordQuery = keywordFilter.trim().toLowerCase();
    const locationQuery = locationFilter.trim().toLowerCase();
    const modeQuery = modeFilter.trim().toLowerCase();
    const minStipend = Number.parseInt(stipendFilter, 10);

    const careerKeywords = selectedCareer
      ? selectedCareer
          .split(' ')
          .map((item) => item.trim())
          .filter((item) => item.length > 2)
      : [];

    return internships.filter((item) => {
      const searchableText = `${item.title || ''} ${item.company || ''} ${item.careerTags || ''} ${item.description || ''}`.toLowerCase();
      const location = String(item.location || '').toLowerCase();
      const mode = String(item.mode || '').toLowerCase();
      const stipendValue = getNumericValue(item.stipend);

      if (keywordQuery && !searchableText.includes(keywordQuery)) return false;
      if (locationQuery && !location.includes(locationQuery)) return false;
      if (modeQuery && !mode.includes(modeQuery)) return false;
      if (!Number.isNaN(minStipend) && minStipend > 0 && !Number.isNaN(stipendValue) && stipendValue < minStipend) return false;

      if (!careerKeywords.length) return true;

      return matchesCareerKeywords(`${item.careerTags || ''} ${item.title || ''} ${item.company || ''}`, careerKeywords);
    });
  }, [internships, keywordFilter, locationFilter, modeFilter, selectedCareer, stipendFilter]);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      <h2 className="mb-2" style={{ fontSize: '2.25rem' }}>Internships Reference</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>
        Discover internships that match your career path, preferred location, stipend range, and work mode.
      </p>

      <Card className="mb-6" style={{ padding: '1.2rem' }}>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <Search size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Search internships"
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
            <Briefcase size={16} className="text-secondary" />
            <input
              type="number"
              min="0"
              placeholder="Minimum stipend"
              value={stipendFilter}
              onChange={(e) => setStipendFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', boxShadow: 'none' }}
            />
          </div>
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <CalendarDays size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Mode (Remote/On-site/Hybrid)"
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
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

      {!filteredInternships.length ? (
        <Card>
          <h3 className="mb-2">No matching internships found</h3>
          <p className="text-secondary">Try changing filters, or ask admin to publish more internship opportunities.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredInternships.map((item) => (
            <Card key={item.id || `${item.title}-${item.company}`} style={{ padding: '1.2rem' }}>
              <div className="flex justify-between items-start" style={{ gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{item.title || 'Internship'}</h3>
                  <p className="text-secondary" style={{ marginTop: '0.3rem', marginBottom: 0 }}>
                    <MapPin size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> {item.location || 'Location not provided'}
                  </p>
                </div>
                <span style={{ padding: '0.3rem 0.6rem', background: '#f4f5f7', borderRadius: '999px', fontSize: '0.85rem' }}>
                  {item.mode || 'Hybrid'}
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
                <p className="mb-1"><strong>Company:</strong> {item.company || 'Not provided'}</p>
                <p className="mb-1"><strong>Stipend:</strong> {item.stipend || 'Not provided'}</p>
                <p className="mb-1"><strong>Duration:</strong> {item.duration || 'Not provided'}</p>
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

export default InternshipsReference;