import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { Users, Activity, TrendingUp, UserCheck, FileText } from 'lucide-react';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const migrateLegacyAssessmentSubmissions = () => {
  const migrationKey = 'assessmentSubmissionsMigrationV1Done';
  if (localStorage.getItem(migrationKey) === 'true') {
    return;
  }

  const studentName = (localStorage.getItem('studentName') || '').trim();
  const progress = parseInt(localStorage.getItem('guidance_plus_progress') || '0', 10);
  const questions = parseJson(localStorage.getItem('guidance_plus_questions'), []);
  const submissions = parseJson(localStorage.getItem('assessmentSubmissions'), []);

  const totalQuestions = Array.isArray(questions) && questions.length ? questions.length : 5;
  const isLegacyCompleted = progress > totalQuestions;

  const alreadyHasSubmission = submissions.some((submission) => submission.studentName === studentName);

  if (studentName && isLegacyCompleted && !alreadyHasSubmission) {
    submissions.push({
      id: `assessment-migrated-${Date.now()}`,
      studentName,
      submittedAt: new Date().toISOString(),
      answers: parseJson(localStorage.getItem('guidance_plus_answers'), {}),
      migrated: true,
    });
    localStorage.setItem('assessmentSubmissions', JSON.stringify(submissions));
  }

  localStorage.setItem(migrationKey, 'true');
};

const AdminOverview = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activeUsers: 0,
    sessionsConducted: 0,
    assessmentsConducted: 0,
    resumeCount: 0,
  });

  useEffect(() => {
    migrateLegacyAssessmentSubmissions();

    const studentSet = new Set();

    const savedStudentName = (localStorage.getItem('studentName') || '').trim();
    if (savedStudentName) studentSet.add(savedStudentName);

    const roadmapData = parseJson(localStorage.getItem('publishedRoadmaps'), {});
    const studyPlanData = parseJson(localStorage.getItem('publishedStudyPlans'), {});
    const resourcesData = parseJson(localStorage.getItem('publishedResources'), {});
    const workshopsData = parseJson(localStorage.getItem('publishedWorkshops'), {});
    const webinarsData = parseJson(localStorage.getItem('publishedWebinars'), {});
    const mockInterviewData = parseJson(localStorage.getItem('publishedMockInterviews'), {});
    const scholarshipsData = parseJson(localStorage.getItem('guidance_plus_scholarships_reference'), []);
    const internshipsData = parseJson(localStorage.getItem('guidance_plus_internships_reference'), []);
    const codingContestData = parseJson(localStorage.getItem('publishedCodingContests'), {});
    const studentsRegistry = parseJson(localStorage.getItem('guidance_plus_students'), []);
    const resumeSubmissions = parseJson(localStorage.getItem('resumeSubmissions'), []);
    const assessmentSubmissions = parseJson(localStorage.getItem('assessmentSubmissions'), []);

    const activeWindowMs = 24 * 60 * 60 * 1000;
    const now = Date.now();

    studentsRegistry.forEach((student) => {
      if (student?.name) studentSet.add(student.name);
    });

    [
      ...Object.keys(roadmapData),
      ...Object.keys(studyPlanData),
      ...Object.keys(resourcesData),
      ...Object.keys(workshopsData),
      ...Object.keys(webinarsData),
      ...Object.keys(mockInterviewData),
      ...Object.keys(codingContestData),
    ].forEach((name) => {
      if (name) studentSet.add(name);
    });

    if (Array.isArray(scholarshipsData) && scholarshipsData.length) {
      studentSet.add('scholarships-reference');
    }

    if (Array.isArray(internshipsData) && internshipsData.length) {
      studentSet.add('internships-reference');
    }

    resumeSubmissions.forEach((submission) => {
      if (submission.studentName) studentSet.add(submission.studentName);
    });

    assessmentSubmissions.forEach((submission) => {
      if (submission.studentName) studentSet.add(submission.studentName);
    });

    const webinarSessionsCount = Object.values(webinarsData).reduce((count, sessions) => {
      if (!Array.isArray(sessions)) return count;
      return count + sessions.filter((session) => session && session.title && session.link).length;
    }, 0);

    const workshopSessionsCount = Object.values(workshopsData).reduce((count, sessions) => {
      if (!Array.isArray(sessions)) return count;
      return count + sessions.filter((session) => session && session.title && session.link).length;
    }, 0);

    const mockSessionsCount = Object.values(mockInterviewData).reduce((count, meeting) => {
      if (meeting && meeting.zoomLink) return count + 1;
      return count;
    }, 0);

    const activeUsersCount = studentsRegistry.filter((student) => {
      if (!student?.lastLoginAt) return false;
      const lastLoginMs = new Date(student.lastLoginAt).getTime();
      if (Number.isNaN(lastLoginMs)) return false;
      return now - lastLoginMs <= activeWindowMs;
    }).length;

    setMetrics({
      totalStudents: studentSet.size,
      activeUsers: activeUsersCount,
      sessionsConducted: webinarSessionsCount + workshopSessionsCount + mockSessionsCount,
      assessmentsConducted: assessmentSubmissions.length,
      resumeCount: resumeSubmissions.length,
    });
  }, []);

  return (
    <div>
      <h2 className="mb-6">System Monitoring & Overview</h2>
      
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(0,82,204,0.1)', borderRadius: '8px' }}><Users className="text-primary" /></div>
          <div><h4 className="text-secondary text-sm">Total Students</h4><h2 className="text-primary">{metrics.totalStudents}</h2></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(0,82,204,0.08)', borderRadius: '8px' }}><UserCheck className="text-primary" /></div>
          <div><h4 className="text-secondary text-sm">Active Users</h4><h2>{metrics.activeUsers}</h2></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(255,127,0,0.1)', borderRadius: '8px' }}><Activity style={{ color: 'var(--color-accent)' }} /></div>
          <div><h4 className="text-secondary text-sm">Sessions Conducted by Admin</h4><h2>{metrics.sessionsConducted}</h2></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(40,167,69,0.1)', borderRadius: '8px' }}><TrendingUp style={{ color: '#28a745' }} /></div>
          <div><h4 className="text-secondary text-sm">Assessments Conducted</h4><h2>{metrics.assessmentsConducted}</h2></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '0.75rem', background: 'rgba(111,66,193,0.1)', borderRadius: '8px' }}><FileText style={{ color: '#6f42c1' }} /></div>
          <div><h4 className="text-secondary text-sm">Resume Count</h4><h2>{metrics.resumeCount}</h2></div>
        </Card>
      </div>
    </div>
  );
};
export default AdminOverview;