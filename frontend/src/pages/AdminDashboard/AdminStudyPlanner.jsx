import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, Calendar } from 'lucide-react';

const STORAGE_KEY = 'publishedStudyPlans';
const STUDENTS_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStudentName = (name) => (name || '').trim();

const createDefaultTask = () => ({
  title: '',
  priority: 'medium',
  status: 'pending',
  deadline: '1 week',
  timePerDay: '1-2 hours/day',
  category: 'coding',
  resourceType: 'youtube',
  resourceLink: '',
});

const createDefaultPlan = () => ({
  title: 'Study Plan',
  tasks: [createDefaultTask(), createDefaultTask()],
});

const normalizeTask = (task = {}) => ({
  ...createDefaultTask(),
  ...task,
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
  if (!plan) return createDefaultPlan();

  const tasks = Array.isArray(plan.tasks) ? plan.tasks.map(normalizeTask) : [];

  return {
    ...createDefaultPlan(),
    ...plan,
    tasks: tasks.length ? tasks : [createDefaultTask(), createDefaultTask()],
  };
};

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const deadlineOptions = ['1 day', '1 week', '1 month'];

const timePerDayOptions = ['1 hour/day', '1-2 hours/day', '2 hours/day'];

const categoryOptions = [
  { value: 'coding', label: 'Coding' },
  { value: 'study', label: 'Study' },
  { value: 'project work', label: 'Project Work' },
  { value: 'interview preparation', label: 'Interview Preparation' },
  { value: 'communication skills', label: 'Communication Skills' },
  { value: 'exam preparation', label: 'Exam Preparation' },
];

const resourceTypeOptions = [
  { value: 'youtube', label: 'YouTube Videos' },
  { value: 'course', label: 'Online Courses' },
  { value: 'article', label: 'Articles' },
];

const AdminStudyPlanner = () => {
  const students = useMemo(() => {
    const registry = parseJson(localStorage.getItem(STUDENTS_KEY), []);
    if (!Array.isArray(registry)) return [];

    const mapped = registry
      .filter((student) => student?.name)
      .map((student) => ({
        name: normalizeStudentName(student.name),
        target: student.selectedCareer || 'Not selected',
      }))
      .filter((student) => student.name);

    return Array.from(new Map(mapped.map((student) => [student.name.toLowerCase(), student])).values());
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.name || '');
  const [plans, setPlans] = useState(() => {
    const publishedPlans = parseJson(localStorage.getItem(STORAGE_KEY), {});
    const initial = {};
    students.forEach((student) => {
      initial[student.name] = normalizePlan(publishedPlans[student.name]);
    });
    return initial;
  });
  const [publishMessage, setPublishMessage] = useState('');

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => student.name.toLowerCase().includes(query));
  }, [searchQuery, students]);

  const selectedPlan = normalizePlan(plans[selectedStudent]);

  const handleTaskChange = (index, field, value) => {
    if (!selectedStudent) return;

    setPlans((prev) => {
      const tasks = [...(prev[selectedStudent]?.tasks || [])];
      tasks[index] = { ...tasks[index], [field]: value };
      return {
        ...prev,
        [selectedStudent]: {
          ...(prev[selectedStudent] || createDefaultPlan()),
          tasks,
        },
      };
    });
  };

  const addTask = () => {
    if (!selectedStudent) return;

    setPlans((prev) => ({
      ...prev,
      [selectedStudent]: {
        ...(prev[selectedStudent] || createDefaultPlan()),
        tasks: [...(prev[selectedStudent]?.tasks || []), createDefaultTask()],
      },
    }));
  };

  const removeTask = (index) => {
    if (!selectedStudent) return;

    setPlans((prev) => ({
      ...prev,
      [selectedStudent]: {
        ...(prev[selectedStudent] || createDefaultPlan()),
        tasks: (prev[selectedStudent]?.tasks || []).filter((_, taskIndex) => taskIndex !== index),
      },
    }));
  };

  const publishPlan = () => {
    const studentKey = normalizeStudentName(selectedStudent);
    if (!studentKey) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    const publishedPlans = raw ? JSON.parse(raw) : {};

    publishedPlans[studentKey] = {
      ...normalizePlan(selectedPlan),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(publishedPlans));
    setPublishMessage(`Study plan published for ${studentKey}.`);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <h2 className="mb-6" style={{ fontSize: '2.35rem' }}>Student Study Plans</h2>
      <p className="text-secondary mb-6" style={{ fontSize: '1.05rem' }}>Create and publish study tasks for each student.</p>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(320px, 1.05fr) minmax(0, 1.9fr)' }}>
        <div className="md:col-span-1">
          <Card className="h-full" style={{ padding: '2rem' }}>
            <h3 className="mb-4" style={{ fontSize: '1.45rem' }}>Select Student</h3>
            <div className="flex items-center gap-3 mb-4" style={{ background: '#f4f5f7', padding: '0.85rem 1rem', borderRadius: '12px' }}>
              <Search className="text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem' }}
              />
            </div>

            <div className="flex flex-col gap-3">
              {!filteredStudents.length && (
                <p className="text-secondary text-sm" style={{ fontSize: '1rem' }}>No students found in User Management.</p>
              )}
              {filteredStudents.map((student) => {
                const isSelected = selectedStudent === student.name;
                return (
                  <button
                    key={student.name}
                    type="button"
                    onClick={() => {
                      setSelectedStudent(student.name);
                      setPublishMessage('');
                    }}
                    style={{
                      padding: '1rem 1.05rem',
                      background: isSelected ? 'rgba(0,82,204,0.1)' : 'white',
                      border: isSelected ? '1px solid var(--color-primary)' : '1px solid #dfe1e6',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <strong style={{ fontSize: '1rem' }}>{student.name}</strong>
                    <p className="text-secondary text-sm" style={{ fontSize: '0.92rem' }}>Target: {student.target}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full" style={{ padding: '2rem' }}>
            {!selectedStudent ? (
              <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Select a student to create a study plan.</p>
            ) : (
              <>
            <div className="flex justify-between items-center mb-6" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div className="flex items-center gap-3">
                <div style={{ padding: '0.75rem', background: '#f4f5f7', borderRadius: '12px' }}>
                  <Calendar className="text-primary" size={22} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.65rem' }}>Study Plan: {selectedStudent}</h3>
              </div>
              <Button variant="accent" onClick={publishPlan}>Publish Updates</Button>
            </div>

            {publishMessage && (
              <p className="text-sm" style={{ color: '#28a745', marginTop: '-0.25rem', marginBottom: '1.25rem', fontSize: '0.98rem' }}>
                {publishMessage}
              </p>
            )}

            <div className="flex flex-col gap-4">
              {!selectedPlan.tasks.length && (
                <p className="text-secondary text-sm" style={{ fontSize: '1rem' }}>No tasks added yet. Click + Add Task.</p>
              )}
              {selectedPlan.tasks.map((task, index) => (
                <div key={`${task.title}-${index}`} style={{ border: '1px solid #dfe1e6', borderRadius: '12px', padding: '1rem' }}>
                  <input
                    type="text"
                    value={task.title || ''}
                    onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                    placeholder={`Task name ${index + 1}`}
                    style={{ marginBottom: '0.75rem', padding: '0.95rem 1rem', fontSize: '1rem' }}
                  />
                  <div className="grid md:grid-cols-2 gap-3">
                    <select
                      value={task.priority}
                      onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                      style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label} Priority</option>
                      ))}
                    </select>
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskChange(index, 'status', e.target.value)}
                      style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select
                      value={task.deadline || '1 week'}
                      onChange={(e) => handleTaskChange(index, 'deadline', e.target.value)}
                      style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                    >
                      {deadlineOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <select
                      value={task.timePerDay || '1-2 hours/day'}
                      onChange={(e) => handleTaskChange(index, 'timePerDay', e.target.value)}
                      style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                    >
                      {timePerDayOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <select
                      value={task.category || 'coding'}
                      onChange={(e) => handleTaskChange(index, 'category', e.target.value)}
                      style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select
                      value={task.resourceType || 'youtube'}
                      onChange={(e) => handleTaskChange(index, 'resourceType', e.target.value)}
                      style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                    >
                      {resourceTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      placeholder="Resource link"
                      value={task.resourceLink || ''}
                      onChange={(e) => handleTaskChange(index, 'resourceLink', e.target.value)}
                      style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-3" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                    <p className="text-secondary text-sm" style={{ margin: 0, fontSize: '0.92rem' }}>
                      Structure the task with deadline, daily time, category, and resource.
                    </p>
                    <Button variant="ghost" onClick={() => removeTask(index)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.95rem' }}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <div>
                <Button variant="primary" onClick={addTask} style={{ padding: '0.6rem 1.05rem', fontSize: '0.95rem' }}>
                  + Add Task
                </Button>
              </div>
            </div>
            </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminStudyPlanner;