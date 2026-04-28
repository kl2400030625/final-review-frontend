import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FileText, Download, CheckCircle, Clock3 } from 'lucide-react';
import {
  getResumeDownloadUrl,
  listResumes,
  reviewResume,
  uploadCorrectedResume,
} from '../../services/resumeService';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const openFile = (url) => {
  if (!url) return;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.click();
};

const mapResume = (item) => ({
  id: item.id,
  studentName: item.studentEmail || 'Student',
  fileName: item.originalFileName,
  submittedAt: item.createdAt,
  status: String(item.status || '').toLowerCase() === 'reviewed' || String(item.status || '').toLowerCase() === 'corrected' ? 'reviewed' : 'pending',
  adminFeedback: item.feedback || '',
  correctedFileName: item.correctedStoredFileName || '',
  downloadUrl: getResumeDownloadUrl(item.id),
  correctedDownloadUrl: item.correctedStoredFileName ? getResumeDownloadUrl(item.id) : '',
});

const ResumeReview = () => {
  const correctedResumeInputRef = useRef(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [correctedResumeFileName, setCorrectedResumeFileName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadResumes = async () => {
      try {
        const allResumes = await listResumes();
        const sorted = [...allResumes]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map(mapResume);

        if (cancelled) return;
        setSubmissions(sorted);

        if (sorted.length) {
          setSelectedId(sorted[0].id);
          setAdminFeedback(sorted[0].adminFeedback || '');
          setCorrectedResumeFileName(sorted[0].correctedFileName || '');
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
  }, []);

  const selectedSubmission = useMemo(
    () => submissions.find((item) => item.id === selectedId),
    [submissions, selectedId]
  );

  const selectSubmission = (submission) => {
    setSelectedId(submission.id);
    setAdminFeedback(submission.adminFeedback || '');
    setCorrectedResumeFileName(submission.correctedFileName || '');
    setMessage('');
    setError('');
  };

  const saveDraft = async () => {
    if (!selectedSubmission) return;
    try {
      setSubmitting(true);
      setMessage('');
      setError('');
      const updatedResume = await reviewResume(selectedSubmission.id, adminFeedback);
      const mapped = mapResume(updatedResume);
      setSubmissions((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
      setMessage('Feedback saved successfully.');
    } catch (saveError) {
      setError(saveError?.response?.data?.message || 'Unable to save feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const sendToStudent = async () => {
    if (!selectedSubmission) return;
    try {
      setSubmitting(true);
      setMessage('');
      setError('');
      const updatedResume = await reviewResume(selectedSubmission.id, adminFeedback);
      const mapped = mapResume(updatedResume);
      setSubmissions((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
      setMessage(`Review sent to ${selectedSubmission.studentName}.`);
    } catch (sendError) {
      setError(sendError?.response?.data?.message || 'Unable to send review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCorrectedResumeUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const valid = file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx');
    if (!valid) {
      alert('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert('Please upload a corrected resume smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const updatedResume = await uploadCorrectedResume(selectedSubmission.id, file);
      const mapped = mapResume(updatedResume);
      setCorrectedResumeFileName(file.name);
      setSubmissions((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
      setMessage(`Corrected resume prepared for ${selectedSubmission?.studentName || 'student'}.`);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || 'Unable to upload the corrected resume file.');
    } finally {
      setSubmitting(false);
      event.target.value = '';
    }
  };

  const exportData = () => {
        const payload = JSON.stringify(submissions, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'resume-submissions.json';
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Resume Review</h2>
        <Button variant="outline" onClick={exportData}><Download size={18} className="mr-2" /> Export All Data</Button>
      </div>

      <p className="text-secondary mb-6">Review student resumes, modify suggestions, and send feedback back to students.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <h3 className="mb-4">Recent Submissions</h3>

            {!submissions.length ? (
              <p className="text-secondary">No submissions yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {submissions.map((submission) => {
                  const isSelected = selectedId === submission.id;
                  const isReviewed = submission.status === 'reviewed';
                  return (
                    <button
                      key={submission.id}
                      type="button"
                      onClick={() => selectSubmission(submission)}
                      style={{
                        padding: '0.75rem',
                        border: isSelected ? '1px solid var(--color-primary)' : '1px solid #dfe1e6',
                        background: isSelected ? 'rgba(0,82,204,0.1)' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <strong>{submission.studentName}</strong>
                        {isReviewed ? <CheckCircle size={16} className="text-primary" /> : <Clock3 size={16} className="text-secondary" />}
                      </div>
                      <p className="text-secondary text-sm mt-1" style={{ marginBottom: 0 }}>{submission.fileName}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            {!selectedSubmission ? (
              <p className="text-secondary">Select a submission to start review.</p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid #dfe1e6' }}>
                  <div className="flex items-center gap-4">
                    <div style={{ padding: '0.5rem', background: '#f4f5f7', borderRadius: '8px' }}>
                      <FileText className="text-primary" />
                    </div>
                    <div>
                      <h3 style={{ marginBottom: '0.2rem' }}>{selectedSubmission.fileName}</h3>
                      <div className="text-secondary text-sm">
                        Submitted by {selectedSubmission.studentName} • {new Date(selectedSubmission.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-secondary text-sm">
                    Current Status: {selectedSubmission.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                  </div>
                </div>

                <div className="mb-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {selectedSubmission.fileDataUrl && (
                    <Button variant="outline" onClick={() => openFile(selectedSubmission.fileDataUrl, selectedSubmission.fileName)}>
                      <Download size={16} className="mr-2" /> Download Original Resume
                    </Button>
                  )}
                  <input
                    ref={correctedResumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCorrectedResumeUpload}
                    style={{ display: 'none' }}
                  />
                  <Button variant="primary" type="button" onClick={() => correctedResumeInputRef.current?.click()}>
                    <Download size={16} className="mr-2" /> Upload Corrected Resume
                  </Button>
                </div>

                {selectedSubmission.correctedDownloadUrl && (
                  <div className="mb-4" style={{ border: '1px solid #dfe1e6', borderRadius: '8px', padding: '0.9rem', background: '#f8fafc' }}>
                    <div className="flex justify-between items-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <strong>Corrected Resume Ready</strong>
                        <div className="text-secondary text-sm">{correctedResumeFileName || selectedSubmission.correctedFileName}</div>
                      </div>
                      <Button variant="outline" onClick={() => openFile(selectedSubmission.correctedDownloadUrl)}>
                        <Download size={16} className="mr-2" /> Download Corrected Resume
                      </Button>
                    </div>
                  </div>
                )}

                {message && (
                  <p className="text-sm" style={{ color: '#28a745', marginBottom: '1rem' }}>{message}</p>
                )}
                {error && (
                  <p className="text-sm" style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
                )}

                <div className="mb-4">
                  <label>Status</label>
                  <input type="text" value={selectedSubmission.status === 'reviewed' ? 'Reviewed' : 'Pending'} disabled />
                </div>

                <div className="mb-4">
                  <label>Feedback to Student</label>
                  <textarea
                    rows="5"
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    placeholder="Write overall feedback and improvements"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                  {selectedSubmission.downloadUrl && (
                    <Button variant="outline" onClick={() => openFile(selectedSubmission.downloadUrl)}>
                      Download Original Resume
                    </Button>
                  )}
                  <Button variant="outline" onClick={saveDraft} disabled={submitting}>Save Feedback</Button>
                  <Button variant="primary" onClick={sendToStudent} disabled={submitting}>Send to Student</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeReview;
