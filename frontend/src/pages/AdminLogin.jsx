import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin@123') {
      nav('/admin-dashboard');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1626' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="flex justify-center mb-4">
          <Shield size={48} className="text-primary" />
        </div>
        <h2 className="text-center mb-2" style={{ color: '#172b4d' }}>Admin Portal</h2>
        <p className="text-center mb-6 text-secondary">Secure access for system administrators</p>
        
        {error && (
          <div style={{ background: '#ffebe6', color: '#bf2600', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <div className="mb-4">
            <label>Admin Username</label>
            <input 
              type="text" 
              placeholder="Enter username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="mb-8">
            <label>Admin Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="w-full" style={{ width: '100%' }}>Secure Login</Button>
          <div className="text-center mt-6">
            <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Return to Student Portal</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default AdminLogin;