import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = () => {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #dfe1e6',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 className="text-primary" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              background: 'var(--color-primary-gradient)', 
              color: 'white', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '8px' 
            }}>G</span>
            Guidance<span style={{ color: 'var(--color-accent)' }}>+</span>
          </h2>
        </Link>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Home</Link>
          <a href="#how-it-works" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>How it Works</a>
          <a href="#features" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Features</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/admin-login" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: '1rem' }}>
            Admin Login
          </Link>
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
