import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import { GraduationCap, Search, MapPin, IndianRupee, Star, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'guidance_plus_colleges_reference';
const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStudentName = (name) => (name || '').trim();

const toList = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getFeeValue = (feesText) => {
  const match = String(feesText || '').replace(/,/g, '').match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : NaN;
};

const matchesAnyKeyword = (text, keywords) => {
  const normalizedText = String(text || '').toLowerCase();
  return keywords.some((keyword) => normalizedText.includes(keyword));
};

const UniversitiesReference = () => {
  const studentName = normalizeStudentName(localStorage.getItem('studentName') || 'Student');

  const selectedCareer = useMemo(() => {
    const students = parseJson(localStorage.getItem(STUDENTS_KEY), []);
    const student = Array.isArray(students)
      ? students.find((item) => normalizeStudentName(item.name).toLowerCase() === studentName.toLowerCase())
      : null;

    return normalizeStudentName(student?.selectedCareer || '').toLowerCase();
  }, [studentName]);

  const colleges = useMemo(() => {
    const stored = parseJson(localStorage.getItem(STORAGE_KEY), []);
    return Array.isArray(stored) ? stored : [];
  }, []);

  const [courseFilter, setCourseFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [examFilter, setExamFilter] = useState('');

  const filteredColleges = useMemo(() => {
    const courseQuery = courseFilter.trim().toLowerCase();
    const locationQuery = locationFilter.trim().toLowerCase();
    const examQuery = examFilter.trim().toLowerCase();
    const maxBudget = Number.parseInt(budgetFilter, 10);

    const careerKeywords = selectedCareer
      ? selectedCareer
          .split(' ')
          .map((item) => item.trim())
          .filter((item) => item.length > 2)
      : [];

    return colleges.filter((college) => {
      const courses = String(college.courses || '').toLowerCase();
      const location = String(college.location || '').toLowerCase();
      const exams = String(college.entranceExams || '').toLowerCase();
      const tags = String(college.careerTags || '').toLowerCase();
      const feeValue = getFeeValue(college.fees);

      if (courseQuery && !courses.includes(courseQuery)) return false;
      if (locationQuery && !location.includes(locationQuery)) return false;
      if (examQuery && !exams.includes(examQuery)) return false;
      if (!Number.isNaN(maxBudget) && maxBudget > 0 && !Number.isNaN(feeValue) && feeValue > maxBudget) return false;

      if (!careerKeywords.length) return true;

      return matchesAnyKeyword(`${tags} ${courses}`, careerKeywords);
    });
  }, [colleges, courseFilter, locationFilter, budgetFilter, examFilter, selectedCareer]);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      <h2 className="mb-2" style={{ fontSize: '2.25rem' }}>Universities & Colleges Reference</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>
        Explore colleges based on your course, location, budget, entrance exam, and career preference.
      </p>

      <Card className="mb-6" style={{ padding: '1.2rem' }}>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <Search size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Filter by course"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
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
            <IndianRupee size={16} className="text-secondary" />
            <input
              type="number"
              min="0"
              placeholder="Max budget"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', boxShadow: 'none' }}
            />
          </div>
          <div className="flex items-center gap-2" style={{ background: '#f4f5f7', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <GraduationCap size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Entrance exam (JEE/NEET)"
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
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

      {!filteredColleges.length ? (
        <Card>
          <h3 className="mb-2">No matching colleges found</h3>
          <p className="text-secondary">Try changing filters, or ask admin to add more institutions.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredColleges.map((college) => {
            const courses = toList(college.courses);
            const exams = toList(college.entranceExams);
            return (
              <Card key={college.id || `${college.name}-${college.location}`} style={{ padding: '1.2rem' }}>
                <div className="flex justify-between items-start" style={{ gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{college.name || 'College'}</h3>
                    <p className="text-secondary" style={{ marginTop: '0.3rem', marginBottom: 0 }}>
                      <MapPin size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> {college.location || 'Location not provided'}
                    </p>
                  </div>
                  <span style={{ padding: '0.3rem 0.6rem', background: '#f4f5f7', borderRadius: '999px', fontSize: '0.85rem' }}>
                    <Star size={14} style={{ marginRight: '0.2rem', verticalAlign: 'middle' }} /> {college.rating || 'N/A'}
                  </span>
                </div>

                <div className="mt-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {courses.map((course) => (
                    <span key={course} style={{ padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(0,82,204,0.08)', color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                      {course}
                    </span>
                  ))}
                </div>

                <div className="mt-3 text-secondary" style={{ fontSize: '0.95rem' }}>
                  <p className="mb-1"><strong>Approx. Fees:</strong> {college.fees || 'Not provided'}</p>
                  <p className="mb-1"><strong>Eligibility:</strong> {college.eligibility || 'Not provided'}</p>
                  <p className="mb-1"><strong>Entrance Exams:</strong> {exams.length ? exams.join(', ') : 'Not provided'}</p>
                </div>

                {college.website && (
                  <a href={college.website} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                    Visit Official Website <ExternalLink size={14} />
                  </a>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UniversitiesReference;
