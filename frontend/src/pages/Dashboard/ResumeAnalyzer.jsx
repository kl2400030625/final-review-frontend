import React, { useEffect, useRef, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { UploadCloud, CheckCircle, Clock3, Download } from 'lucide-react';
import { getResumeDownloadUrl, listResumes, uploadResume } from '../../services/resumeService';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const normalizeStudentName = (name) => (name || '').trim();
const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const openFileInNewTab = (url) => {
  if (!url) return;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.click();
};

const getStudentEmail = (studentName) => {
  const savedEmail = (localStorage.getItem('studentEmail') || '').trim().toLowerCase();
  if (savedEmail) return savedEmail;

  const students = parseJson(localStorage.getItem('guidance_plus_students'), []);
  const matched = students.find((student) => normalizeStudentName(student?.name).toLowerCase() === studentName.toLowerCase());
  return (matched?.email || '').trim().toLowerCase();
};

const mapResume = (item) => ({
  id: item.id,
  fileName: item.originalFileName,
  submittedAt: item.createdAt,
  status: String(item.status || '').toLowerCase() === 'reviewed' || String(item.status || '').toLowerCase() === 'corrected' ? 'reviewed' : 'pending',
  adminFeedback: item.feedback || '',
  reviewedAt: item.createdAt,
  downloadUrl: getResumeDownloadUrl(item.id),
  correctedDownloadUrl: item.correctedStoredFileName ? getResumeDownloadUrl(item.id) : '',
});

const ResumeAnalyzer = () => {
  const fileInputRef = useRef(null);
  const studentName = normalizeStudentName(localStorage.getItem('studentName') || 'Jane Doe');
  const studentEmail = getStudentEmail(studentName);
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadResumes = async () => {
      try {
        const allResumes = await listResumes();
        const studentResumes = allResumes
          .filter((item) => !studentEmail || String(item.studentEmail || '').toLowerCase() === studentEmail.toLowerCase())
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map(mapResume);

        if (!cancelled) {
          setSubmissions(studentResumes);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.response?.data?.message || 'Unable to load resume submissions.');
        }
      }
    };

    loadResumes();
    return () => {
      cancelled = true;
    };
  }, [studentEmail]);

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const extension = file.name.toLowerCase();
    const isValidType = extension.endsWith('.pdf') || extension.endsWith('.doc') || extension.endsWith('.docx');
    if (!isValidType) {
      alert('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert('Please upload a file smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    try {
      setUploading(true);
      setMessage('');
      setError('');
      const created = await uploadResume(file, studentEmail);
      setSubmissions((prev) => [mapResume(created), ...prev]);
      setMessage('Resume uploaded successfully.');
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || uploadError?.response?.data?.error || 'Resume upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const latestReviewed = submissions.find((item) => item.status === 'reviewed');

  return (
    <div>
      <h2 className="mb-4">Resume Analyzer</h2>
      <Card className="text-center" style={{ padding: '4rem 2rem', border: '2px dashed #dfe1e6', background: 'var(--bg-main)' }}>
        <UploadCloud size={64} className="text-primary mb-4" style={{ margin: '0 auto' }} />
        <h3 className="mb-2">Upload Resume for Admin Review</h3>
        <p className="mb-6">Upload your PDF or Word document. Admin can modify feedback and send suggestions back to you.</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <Button type="button" variant="accent" onClick={openFilePicker} disabled={uploading || !studentEmail}>
          {uploading ? 'Uploading...' : 'Browse Files'}
        </Button>
        {!studentEmail && (
          <p className="text-secondary mt-4">Log in with a valid email before uploading a resume.</p>
        )}
        {message && <p className="mt-4" style={{ color: '#28a745' }}>{message}</p>}
        {error && <p className="mt-4" style={{ color: '#dc3545' }}>{error}</p>}
      </Card>

      <h3 className="mt-8 mb-4">Submission History</h3>
      <Card>
        {!submissions.length ? (
          <p className="text-secondary">No resume submitted yet.</p>
        ) : (
          <div className="flex flex-col" style={{ gap: '0.75rem' }}>
            {submissions.map((submission) => {
              const isReviewed = submission.status === 'reviewed';
              return (
                <div key={submission.id} className="flex items-center justify-between" style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '0.9rem' }}>
                  <div className="flex items-center gap-3">
                    {isReviewed ? <CheckCircle className="text-primary" /> : <Clock3 className="text-secondary" />}
                    <div>
                      <strong>{submission.fileName}</strong>
                      <div className="text-secondary text-sm">
                        Submitted {new Date(submission.submittedAt).toLocaleString()} • {isReviewed ? 'Reviewed' : 'Pending admin review'}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{isReviewed ? 'Reviewed' : 'Pending'}</div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <h3 className="mt-8 mb-4">Admin Feedback</h3>
      <Card>
        {!latestReviewed ? (
          <p className="text-secondary">Feedback will appear here after admin reviews your submission.</p>
        ) : (
          <div>
            <p className="mb-2"><strong>For:</strong> {latestReviewed.fileName}</p>
            <p className="mb-2"><strong>Reviewed:</strong> {latestReviewed.reviewedAt ? new Date(latestReviewed.reviewedAt).toLocaleString() : 'Recently'}</p>

            <div style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem', marginTop: '0.75rem', background: '#f8fafc' }}>
              <h4 className="mb-2">Feedback</h4>
              <p className="text-secondary" style={{ marginBottom: 0 }}>
                {latestReviewed.adminFeedback || 'No feedback provided yet.'}
              </p>
            </div>

            {latestReviewed.correctedDownloadUrl && (
              <div style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '1rem', marginTop: '0.75rem' }}>
                <h4 className="mb-2">Corrected Resume Download</h4>
                <p className="text-secondary" style={{ marginBottom: '0.75rem' }}>Download the corrected resume uploaded by the admin.</p>
                <Button variant="primary" onClick={() => openFileInNewTab(latestReviewed.correctedDownloadUrl)}>
                  <Download size={16} className="mr-2" /> Download Corrected Resume
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResumeAnalyzer;
