import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PlayCircle, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'publishedResources';

const normalizeStudentName = (name) => (name || '').trim();
const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getResourcesForStudent = (publishedResources, studentName) => {
  const normalizedName = normalizeStudentName(studentName);
  if (!normalizedName) return [];

  if (Array.isArray(publishedResources[normalizedName])) {
    return publishedResources[normalizedName];
  }

  const caseInsensitiveMatchKey = Object.keys(publishedResources).find(
    (key) => key.toLowerCase() === normalizedName.toLowerCase()
  );

  if (caseInsensitiveMatchKey && Array.isArray(publishedResources[caseInsensitiveMatchKey])) {
    return publishedResources[caseInsensitiveMatchKey];
  }

  return [];
};

const openDataUrlInNewTab = (dataUrl) => {
  if (!dataUrl) return;

  const parts = dataUrl.split(',');
  if (parts.length < 2) return;

  const header = parts[0];
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

  try {
    const binary = atob(parts[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch {
    window.open(dataUrl, '_blank', 'noopener,noreferrer');
  }
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const studentName = normalizeStudentName(localStorage.getItem('studentName') || 'Jane Doe');

  useEffect(() => {
    const publishedResources = parseJson(localStorage.getItem(STORAGE_KEY), {});
    setResources(getResourcesForStudent(publishedResources, studentName));
  }, [studentName]);

  if (!resources.length) {
    return (
      <div className="student-resources-page">
        <h2 className="mb-6">Learning Resources</h2>
        <Card className="resources-empty-card">
          <h3 className="mb-2">No resources assigned yet</h3>
          <p className="text-secondary">Your admin will publish resources for you here.</p>
        </Card>
      </div>
    );
  }

  const iconFor = (item) => {
    if (item.type === 'video') return <PlayCircle size={48} className="text-primary" style={{ opacity: 0.6 }} />;
    if (item.type === 'image') return <ImageIcon size={48} className="text-primary" style={{ opacity: 0.6 }} />;
    return <FileText size={48} className="text-primary" style={{ opacity: 0.6 }} />;
  };

  const actionLabel = (item) => {
    if (item.type === 'video') return 'Open Video';
    if (item.type === 'pdf') return 'Open PDF';
    if (item.type === 'image') return 'Open Image';
    return 'Open Resource';
  };

  return (
    <div className="student-resources-page">
      <div className="resources-page-header">
        <h2 className="mb-6">Learning Resources</h2>
        <p className="text-secondary">Access videos, links, PDFs, and images assigned by your admin.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 resources-grid">
        {resources.map((item, index) => {
          const hasUploadedFile = Boolean(item.dataUrl);
          const href = item.url || '#';
          return (
            <Card key={`${item.title}-${index}`} className="resource-item-card">
              <div className="resource-icon-shell" style={{ height: '160px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {iconFor(item)}
              </div>
              <h3 className="card-title">{item.title || `Resource ${index + 1}`}</h3>
              <p className="mb-4 text-sm">{item.description || 'No description provided.'}</p>

              {item.fileName && (
                <p className="text-secondary text-sm" style={{ marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
                  File: {item.fileName}
                </p>
              )}

              {hasUploadedFile ? (
                <Button
                  variant="outline"
                  onClick={() => openDataUrlInNewTab(item.dataUrl)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <ExternalLink size={16} /> {actionLabel(item)}
                </Button>
              ) : (
                <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <ExternalLink size={16} /> {actionLabel(item)}
                  </Button>
                </a>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Resources;
