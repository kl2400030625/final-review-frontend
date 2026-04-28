import React from 'react';

const ProgressBar = ({ progress, className = '' }) => {
  return (
    <div className={`progress-bg ${className}`} style={{ width: '100%', height: '8px', background: '#dfe1e6', borderRadius: '4px', overflow: 'hidden' }}>
      <div 
        className="progress-fill" 
        style={{ 
          width: `${progress}%`, 
          height: '100%', 
          background: 'var(--color-primary-gradient)', 
          transition: 'width 0.3s ease' 
        }} 
      />
    </div>
  );
};

export default ProgressBar;
