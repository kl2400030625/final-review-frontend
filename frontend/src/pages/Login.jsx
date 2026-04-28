import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { loginUser } from '../services/authService';

const STUDENTS_STORAGE_KEY = 'guidance_plus_students';

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const upsertStudent = (name, email) => {
  const students = parseJson(localStorage.getItem(STUDENTS_STORAGE_KEY), []);
  const normalizedEmail = (email || '').trim().toLowerCase();
  const displayName = (name || '').trim() || 'Student';
  const studentId = normalizedEmail || `name:${displayName.toLowerCase()}`;

  const existingIndex = students.findIndex((student) => student.id === studentId);
  const payload = {
    id: studentId,
    name: displayName,
    email: normalizedEmail,
    lastLoginAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    students[existingIndex] = { ...students[existingIndex], ...payload };
  } else {
    students.push(payload);
  }

  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
};

const deriveDisplayName = (email) => {
  const rawName = (email || '').split('@')[0].trim();
  const formattedFromEmail = rawName
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

  return formattedFromEmail || 'Student';
};

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      const userEmail = res?.data?.user?.email || res?.data?.email || email;
      const displayName = res?.data?.user?.name || res?.data?.name || res?.data?.studentName || deriveDisplayName(userEmail);

      localStorage.setItem('studentName', displayName);
      upsertStudent(displayName, userEmail);
      nav('/dashboard');
      return;
    } catch (backendError) {
      setError(
        backendError?.response?.data?.message
        || backendError?.response?.data?.error
        || 'Unable to log in. Please check your credentials or backend status.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 className="text-center mb-4 text-primary">Student Login</h2>
        <p className="text-center mb-6">Log in to continue your career journey</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label>Student Email</label>
            <input 
              type="email" 
              placeholder="student@domain.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-8">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="w-full" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {error && <p className="text-center mt-3" style={{ color: '#dc3545' }}>{error}</p>}
          <p className="text-center mt-4">Use your email to continue.</p>
          <p className="text-center mt-2">
            <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
              New user? Register here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
export default Login;