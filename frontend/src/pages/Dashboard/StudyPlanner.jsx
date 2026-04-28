import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { CheckSquare, Circle } from 'lucide-react';

const STORAGE_KEY = 'publishedStudyPlans';

const formatValue = (value) => value || 'Not set';

const normalizeTask = (task = {}) => ({
  title: task.title || '',
  priority: task.priority || 'medium',
  status: task.status || 'pending',
  deadline: task.deadline || '1 week',
  timePerDay: task.timePerDay || '1-2 hours/day',
  category: task.category || 'coding',
  resourceType: task.resourceType || 'youtube',
  resourceLink: task.resourceLink || '',
});

const normalizePlan = (plan) => {
  if (!plan || !Array.isArray(plan.tasks)) return null;

  return {
    ...plan,
    tasks: plan.tasks.map(normalizeTask),
  };
};

const StudyPlanner = () => {
  const [plan, setPlan] = useState(null);
  const studentName = localStorage.getItem('studentName') || 'Jane Doe';

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setPlan(null);
      return;
    }

    const publishedPlans = JSON.parse(raw);
    const exactPlan = publishedPlans[studentName] || Object.keys(publishedPlans).find((key) => key.toLowerCase() === studentName.toLowerCase());
    setPlan(normalizePlan(typeof exactPlan === 'string' ? publishedPlans[exactPlan] : exactPlan ? publishedPlans[exactPlan] : null));
  }, [studentName]);

  if (!plan || !plan.tasks || plan.tasks.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2>Study Planner</h2>
        </div>

        <Card className="mb-6">
          <h3 className="mb-2">No study plan assigned yet</h3>
          <p className="text-secondary">Your admin will publish your study tasks here.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Study Planner</h2>
      </div>
      
      <Card className="mb-6">
        <h3 className="mb-4">Today</h3>
        {plan.tasks.map((task, index) => {
          const isCompleted = task.status === 'completed';
          const priorityText = task.priority ? `${task.priority.charAt(0).toUpperCase()}${task.priority.slice(1)} Priority` : null;

          return (
            <div
              key={`${task.title}-${index}`}
              className="flex items-center justify-between p-4 border rounded"
              style={{ borderColor: '#dfe1e6', border: '1px solid #dfe1e6', borderRadius: '8px', marginBottom: index === plan.tasks.length - 1 ? 0 : '0.5rem' }}
            >
              <div className="flex items-center gap-4">
                {isCompleted ? <CheckSquare className="text-primary" /> : <Circle className="text-secondary" />}
                <div style={isCompleted ? { textDecoration: 'line-through', color: 'var(--text-secondary)' } : {}}>
                  <div>{task.title || `Task ${index + 1}`}</div>
                  <div className="text-secondary" style={{ fontSize: '0.88rem', marginTop: '0.25rem' }}>
                    Deadline: {formatValue(task.deadline)} | Time: {formatValue(task.timePerDay)} | Category: {formatValue(task.category)} | Resource: {formatValue(task.resourceType)}
                  </div>
                  {task.resourceLink && (
                    <a href={task.resourceLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', display: 'inline-block', marginTop: '0.25rem' }}>
                      Open resource
                    </a>
                  )}
                </div>
              </div>
              {priorityText && (
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    background: task.priority === 'high' ? 'rgba(255,127,0,0.1)' : '#f4f5f7',
                    color: task.priority === 'high' ? 'var(--color-accent)' : 'var(--text-secondary)',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                  }}
                >
                  {priorityText}
                </span>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
};
export default StudyPlanner;