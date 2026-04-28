import API from '../api/api';

export const listResumes = async () => {
  const response = await API.get('/resume/list');
  return Array.isArray(response.data) ? response.data : [];
};

export const uploadResume = async (file, email) => {
  const formData = new FormData();
  formData.append('file', file);
  if (email) {
    formData.append('email', email);
  }

  const response = await API.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const reviewResume = async (id, feedback) => {
  const response = await API.put(`/resume/${id}/review`, null, {
    params: { feedback },
  });
  return response.data;
};

export const uploadCorrectedResume = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await API.post(`/resume/${id}/corrected`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getResumeDownloadUrl = (id) => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  if (base) {
    return `${base}/resume/download/${id}`;
  }
  return `/api/resume/download/${id}`;
};
