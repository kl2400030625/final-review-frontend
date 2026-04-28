import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser, sendOtp, verifyOtp } from '../services/authService';
import Card from './Card';
import Button from './Button';

const formatErrorMessage = (err, fallbackMessage) => {
  const data = err?.response?.data;

  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    return data.message || data.error || data.detail || JSON.stringify(data);
  }

  if (err?.message) return err.message;
  return fallbackMessage;
};

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await sendOtp(email);
      setOtpVerified(false);
      setMessage(typeof res.data === 'string' ? res.data : (res.data?.message || 'OTP sent successfully.'));
    } catch (err) {
      setError(formatErrorMessage(err, 'Failed to send OTP.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await verifyOtp(email, otp);
      setOtpVerified(true);
      setMessage(typeof res.data === 'string' ? res.data : (res.data?.message || 'OTP verified successfully.'));
    } catch (err) {
      setOtpVerified(false);
      setError(formatErrorMessage(err, 'OTP verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!otpVerified) {
      setError('Please verify OTP before registering.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await registerUser(email, password);
      setMessage(typeof res.data === 'string' ? res.data : (res.data?.message || 'User registered successfully.'));
    } catch (err) {
      setError(formatErrorMessage(err, 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '1.5rem' }}>
      <Card style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
        <h2 className="text-center mb-4 text-primary">Register</h2>
        <p className="text-center mb-6 text-secondary">Send OTP, verify it, then complete registration.</p>

        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleSendOtp} disabled={loading || !email || !password} style={{ width: '100%' }}>
          Send OTP
        </Button>

        <div className="my-4" style={{ height: '1px', background: '#e5e7eb' }} />

        <div className="mb-4">
          <label>OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <Button variant="accent" onClick={handleVerifyOtp} disabled={loading || !otp} style={{ width: '100%' }}>
          Verify OTP
        </Button>

        <div className="my-4" style={{ height: '1px', background: '#e5e7eb' }} />

        <Button variant="primary" onClick={handleRegister} disabled={loading || !email || !password || !otpVerified} style={{ width: '100%' }}>
          Register
        </Button>

        {message && <p className="text-center mt-4" style={{ color: '#28a745' }}>{message}</p>}
        {error && <p className="text-center mt-4" style={{ color: '#dc3545' }}>{error}</p>}
        <p className="text-center mt-4">
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;