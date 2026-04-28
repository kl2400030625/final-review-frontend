import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Map, CheckCircle, Circle, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'publishedRoadmaps';

const StudentRoadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const studentName = localStorage.getItem('studentName') || 'Jane Doe';

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setRoadmap(null);
      return;
    }

    const publishedRoadmaps = JSON.parse(raw);
    setRoadmap(publishedRoadmaps[studentName] || null);
  }, [studentName]);

  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2>Your Personalized Roadmap</h2>
            <p className="text-secondary text-sm mt-1">Your roadmap will appear here after your admin publishes it.</p>
          </div>
        </div>

        <Card>
          <div style={{ padding: '1rem' }}>
            <h3 className="mb-2">No roadmap assigned yet</h3>
            <p className="text-secondary">Please check back later or contact your advisor.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>Your Personalized Roadmap</h2>
          <p className="text-secondary text-sm mt-1">Curated by your career advisor.</p>
        </div>
        <Button variant="outline"><Map size={18} className="mr-2" /> View Full Path</Button>
      </div>

      <Card>
        <div style={{ borderLeft: '2px solid #dfe1e6', marginLeft: '1rem', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
          {roadmap.phases.map((phase, index) => {
            const isCompleted = phase.status === 'completed';
            const isInProgress = phase.status === 'in-progress';

            return (
              <div key={`${phase.title}-${index}`} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.8rem', top: '0', background: 'white', padding: '0.2rem' }}>
                  {isCompleted ? (
                    <CheckCircle size={24} className="text-primary" />
                  ) : (
                    <Circle size={24} className="text-secondary" />
                  )}
                </div>

                <h3 className="mb-2" style={{ color: isCompleted ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                  {phase.title || `Phase ${index + 1}`}
                </h3>

                <p className="text-secondary mb-4">{phase.description || 'No description provided yet.'}</p>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #dfe1e6' }}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Status</span>
                    <span style={{ fontSize: '0.8rem', color: isCompleted ? '#28a745' : (isInProgress ? 'var(--color-accent)' : 'var(--text-secondary)'), fontWeight: 600 }}>
                      {isCompleted ? 'Completed' : (isInProgress ? 'In Progress' : 'Pending')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </Card>
    </div>
  );
};

export default StudentRoadmap;
