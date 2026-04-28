import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, UploadCloud } from 'lucide-react';

const STORAGE_KEY = 'publishedResources';
const STUDENTS_KEY = 'guidance_plus_students';
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStudentName = (name) => (name || '').trim();

const createEmptyResource = () => ({
  title: '',
  description: '',
  sourceType: 'link',
  url: '',
  fileName: '',
  mimeType: '',
  dataUrl: '',
});

const normalizeLink = (link) => {
  const trimmed = link.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const deriveTypeFromMime = (mimeType) => {
  if (!mimeType) return 'file';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'file';
};

const ContentManagement = () => {
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

    return Array.from(new Map(mapped.map((s) => [s.name.toLowerCase(), s])).values());
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.name || '');
  const [resourcesByStudent, setResourcesByStudent] = useState(() => {
    const published = parseJson(localStorage.getItem(STORAGE_KEY), {});
    const initial = {};
    students.forEach((student) => {
      initial[student.name] = Array.isArray(published[student.name]) ? published[student.name] : [];
    });
    return initial;
  });
  const [publishMessage, setPublishMessage] = useState('');

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => student.name.toLowerCase().includes(query));
  }, [searchQuery, students]);

  const selectedResources = resourcesByStudent[selectedStudent] || [];

  const updateResource = (index, field, value) => {
    setResourcesByStudent((prev) => {
      const next = [...(prev[selectedStudent] || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [selectedStudent]: next };
    });
  };

  const onFilePicked = (index, file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setPublishMessage('Selected file is too large for browser storage. Use a file smaller than 2 MB or publish an external link.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      updateResource(index, 'fileName', file.name);
      updateResource(index, 'mimeType', file.type || 'application/octet-stream');
      updateResource(index, 'dataUrl', dataUrl);
      updateResource(index, 'url', '');
      setPublishMessage(`Attached ${file.name}.`);
    };
    reader.onerror = () => {
      setPublishMessage('Unable to read the selected file.');
    };
    reader.readAsDataURL(file);
  };

  const addResource = () => {
    if (!selectedStudent) return;
    setResourcesByStudent((prev) => ({
      ...prev,
      [selectedStudent]: [...(prev[selectedStudent] || []), createEmptyResource()],
    }));
  };

  const removeResource = (index) => {
    setResourcesByStudent((prev) => {
      const remaining = (prev[selectedStudent] || []).filter((_, i) => i !== index);
      return { ...prev, [selectedStudent]: remaining };
    });
  };

  const publishResources = () => {
    const studentKey = normalizeStudentName(selectedStudent);
    if (!studentKey) return;

    const normalized = (selectedResources || [])
      .map((resource) => {
        const isFile = resource.sourceType === 'file';
        if (isFile) {
          return {
            ...resource,
            type: deriveTypeFromMime(resource.mimeType),
          };
        }
        return {
          ...resource,
          type: resource.sourceType === 'video-link' ? 'video' : 'link',
          url: normalizeLink(resource.url),
        };
      })
      .filter((resource) => {
        if (!resource.title?.trim()) return false;
        if (resource.sourceType === 'file') return Boolean(resource.dataUrl);
        return Boolean(resource.url);
      });

    const published = parseJson(localStorage.getItem(STORAGE_KEY), {});
    published[studentKey] = normalized;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(published));
    } catch {
      setPublishMessage('Publish failed: file size is too large for browser storage. Try a smaller file or external link.');
      return;
    }

    setResourcesByStudent((prev) => ({ ...prev, [studentKey]: normalized }));
    setPublishMessage(`Resources published for ${studentKey}.`);
  };

  return (
    <div className="content-management-page" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div className="content-header" style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '2.35rem' }}>Content Management</h2>
        <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Select a student and publish links/files (videos, PDFs, images).</p>
      </div>

      <div className="grid gap-6 content-grid" style={{ gridTemplateColumns: 'minmax(320px, 1.05fr) minmax(0, 1.9fr)' }}>
        <div className="md:col-span-1">
          <Card className="h-full selector-card" style={{ padding: '2rem' }}>
            <h3 className="mb-4 selector-title" style={{ fontSize: '1.45rem' }}>Select Student</h3>
            <div className="flex items-center gap-3 mb-4 selector-search" style={{ background: '#f4f5f7', padding: '0.85rem 1rem', borderRadius: '12px' }}>
              <Search className="text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem', boxShadow: 'none' }}
              />
            </div>

            <div className="flex flex-col gap-3 selector-student-list">
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
                    className={`selector-student-item ${isSelected ? 'is-selected' : ''}`}
                    style={{ padding: '1rem 1.05rem', borderRadius: '12px' }}
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
          <Card className="h-full resources-card" style={{ padding: '2rem' }}>
            {!selectedStudent ? (
              <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Select a student to upload/publish resources.</p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 resources-topbar" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="flex items-center gap-3 resources-topbar-title">
                    <div className="resources-topbar-icon" style={{ padding: '0.75rem', borderRadius: '12px' }}>
                      <UploadCloud className="text-primary" size={22} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.65rem' }}>Resources: {selectedStudent}</h3>
                  </div>
                  <Button variant="accent" onClick={publishResources}>Publish Resources</Button>
                </div>

                {publishMessage && (
                  <p className="text-sm" style={{ color: '#28a745', marginTop: '-0.25rem', marginBottom: '1.25rem', fontSize: '0.98rem' }}>
                    {publishMessage}
                  </p>
                )}

                <div className="flex flex-col gap-5 resource-editor-list">
                  {selectedResources.map((resource, index) => (
                    <div key={`${resource.title}-${index}`} className="resource-editor-item" style={{ borderRadius: '12px', padding: '1rem' }}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Resource Title"
                          value={resource.title}
                          onChange={(e) => updateResource(index, 'title', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />
                        <select
                          value={resource.sourceType || 'link'}
                          onChange={(e) => updateResource(index, 'sourceType', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        >
                          <option value="link">Web Link</option>
                          <option value="video-link">Video Link</option>
                          <option value="file">Upload File (video/pdf/image)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Description"
                          value={resource.description}
                          onChange={(e) => updateResource(index, 'description', e.target.value)}
                          style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                        />

                        {resource.sourceType === 'file' ? (
                          <div>
                            <input
                              type="file"
                              accept="video/*,application/pdf,image/*"
                              onChange={(e) => onFilePicked(index, e.target.files?.[0])}
                              style={{ padding: '0.8rem 0', fontSize: '1rem' }}
                            />
                            {resource.fileName && (
                              <p className="text-secondary text-sm" style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.95rem' }}>
                                Selected: {resource.fileName}
                              </p>
                            )}
                          </div>
                        ) : (
                          <input
                            type="url"
                            placeholder="https://..."
                            value={resource.url}
                            onChange={(e) => updateResource(index, 'url', e.target.value)}
                            style={{ padding: '0.95rem 1rem', fontSize: '1rem' }}
                          />
                        )}
                      </div>

                      <div className="mt-3">
                        <Button variant="ghost" onClick={() => removeResource(index)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.95rem' }}>
                          Remove Resource
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Button variant="primary" onClick={addResource} className="add-resource-btn" style={{ padding: '0.6rem 1.05rem', fontSize: '0.95rem' }}>
                    + Add Resource
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
