const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const dashboardDir = path.join(pagesDir, 'Dashboard');

// Create directories if they don't exist
[pagesDir, dashboardDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  'Home.jsx': `
import React from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import { ArrowRight, Star, Brain, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section style={{ padding: '6rem 0', background: 'var(--color-primary-gradient)', color: 'white', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white' }}>Your AI Career Guide Starts Here</h1>
            <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'rgba(255,255,255,0.9)' }}>
              Navigate your future with AI-powered insights. Assessment, roadmap, and mock interviews tailored just for you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/signup"><Button variant="accent" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started <ArrowRight size={20}/></Button></Link>
              <Link to="/login"><Button style={{ background: 'white', color: 'var(--color-primary)' }}>Log In</Button></Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ padding: '5rem 0', background: 'white' }}>
          <div className="container">
            <h2 className="text-center mb-8">Platform Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <Brain size={40} className="text-primary mb-4" />
                <h3 className="card-title">AI Assessments</h3>
                <p>Advanced multiple-choice engine to accurately gauge your aptitude and skills.</p>
              </Card>
              <Card>
                <Target size={40} className="text-primary mb-4" />
                <h3 className="card-title">Personalized Roadmap</h3>
                <p>Step-by-step guidance mapping out your education and career path.</p>
              </Card>
              <Card>
                <Star size={40} className="text-primary mb-4" />
                <h3 className="card-title">Resume Analyzer</h3>
                <p>Instant feedback to align your resume with industry standards.</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Home;`,

  'Login.jsx': `
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const Login = () => {
  const nav = useNavigate();
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 className="text-center mb-4 text-primary">Welcome Back</h2>
        <p className="text-center mb-8">Log in to continue your career journey</p>
        <form onSubmit={(e) => { e.preventDefault(); nav('/dashboard'); }}>
          <div className="mb-4">
            <label>Email</label>
            <input type="email" placeholder="student@example.com" required />
          </div>
          <div className="mb-8">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" style={{ width: '100%' }}>Login</Button>
          <p className="text-center mt-4">Don't have an account? <Link to="/signup">Sign up</Link></p>
        </form>
      </Card>
    </div>
  );
};
export default Login;`,

  'Signup.jsx': `
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const Signup = () => {
  const nav = useNavigate();
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
      <Card style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
        <h2 className="text-center mb-4 text-primary">Create Account</h2>
        <p className="text-center mb-8">Start your AI career guide today</p>
        <form onSubmit={(e) => { e.preventDefault(); nav('/dashboard'); }}>
          <div className="mb-4">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Doe" required />
          </div>
          <div className="mb-4">
            <label>Email</label>
            <input type="email" placeholder="student@example.com" required />
          </div>
          <div className="mb-8">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" variant="accent" style={{ width: '100%' }}>Sign Up</Button>
          <p className="text-center mt-4">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </Card>
    </div>
  );
};
export default Signup;`,

  'Dashboard/DashboardLayout.jsx': `
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
};
export default DashboardLayout;`,

  'Dashboard/Assessment.jsx': `
import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';

const Assessment = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  return (
    <div>
      <h2 className="mb-4">Career Assessment</h2>
      <Card className="mb-8 p-6">
        <div className="mb-6 flex justify-between items-center">
          <span>Question {step} of {totalSteps}</span>
          <span className="text-primary font-medium">{Math.round(progress)}% Completed</span>
        </div>
        <ProgressBar progress={progress} className="mb-8" />
        
        <div className="mb-8">
          <h3 className="mb-4">Which of the following activities do you enjoy the most?</h3>
          <div className="flex-col gap-4">
            {['Solving complex math problems', 'Designing graphics and user interfaces', 'Writing stories or articles', 'Conducting scientific experiments'].map((opt, i) => (
              <label key={i} className="flex items-center gap-4 p-4 border rounded" style={{ borderColor: '#dfe1e6', cursor: 'pointer', borderRadius: '12px' }}>
                <input type="radio" name="q1" value={i} />
                <span style={{ fontWeight: 400 }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>Previous</Button>
          <Button onClick={() => setStep(Math.min(totalSteps, step + 1))}>Next Question</Button>
        </div>
      </Card>
    </div>
  );
};
export default Assessment;`,

  'Dashboard/Results.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { Trophy, Compass } from 'lucide-react';

const Results = () => {
  return (
    <div>
      <h2 className="mb-4">Assessment Results</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <div style={{ padding: '1rem', background: 'rgba(0,82,204,0.1)', borderRadius: '50%' }}>
            <Trophy className="text-primary" size={32} />
          </div>
          <div>
            <h4 className="text-secondary">Top Match</h4>
            <h2 className="text-primary">Software Engineering</h2>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div style={{ padding: '1rem', background: 'rgba(255,127,0,0.1)', borderRadius: '50%' }}>
            <Compass style={{ color: 'var(--color-accent)' }} size={32} />
          </div>
          <div>
            <h4 className="text-secondary">Secondary Match</h4>
            <h2>Data Science</h2>
          </div>
        </Card>
      </div>

      <h3 className="mb-4">Skill Gap Analysis</h3>
      <Card className="mb-8">
        <div className="flex-col gap-6">
          <div>
            <div className="flex justify-between mb-2"><span>Logical Reasoning</span><span>90%</span></div>
            <ProgressBar progress={90} />
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-2"><span>Creative Thinking</span><span>75%</span></div>
            <ProgressBar progress={75} />
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-2"><span>Communication</span><span>60%</span></div>
            <ProgressBar progress={60} />
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Results;`,

  'Dashboard/ResumeAnalyzer.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { UploadCloud, CheckCircle } from 'lucide-react';

const ResumeAnalyzer = () => {
  return (
    <div>
      <h2 className="mb-4">Resume Analyzer</h2>
      <Card className="text-center" style={{ padding: '4rem 2rem', border: '2px dashed #dfe1e6', background: 'var(--bg-main)' }}>
        <UploadCloud size={64} className="text-primary mb-4" style={{ margin: '0 auto' }} />
        <h3 className="mb-2">Drag & Drop Resume</h3>
        <p className="mb-6">Upload your PDF or Word document to get AI-powered feedback.</p>
        <Button variant="accent">Browse Files</Button>
      </Card>
      
      <h3 className="mt-8 mb-4">Recent Analysis</h3>
      <Card>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <CheckCircle className="text-primary" />
            <div>
              <strong>Jane_Doe_Resume_v2.pdf</strong>
              <div className="text-secondary text-sm">Analyzed on Oct 12</div>
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>85/100</div>
        </div>
      </Card>
    </div>
  );
};
export default ResumeAnalyzer;`,

  'Dashboard/MockInterview.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Mic } from 'lucide-react';

const MockInterview = () => {
  return (
    <div>
      <h2 className="mb-4">Mock Interview Practice</h2>
      <Card className="mb-6">
        <h3 className="mb-2 text-primary">Question 1 / 5</h3>
        <h2 className="mb-6" style={{ fontWeight: 500 }}>"Tell me about a time you had to overcome a difficult challenge."</h2>
        
        <div className="mb-6">
          <textarea 
            rows="6" 
            placeholder="Type your answer here, or use the microphone to record..."
            style={{ width: '100%', resize: 'none', padding: '1rem', border: '1px solid #dfe1e6', borderRadius: '8px' }}
          ></textarea>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Mic size={18} /> Record Answer</Button>
          <Button variant="primary">Submit & Get Feedback</Button>
        </div>
      </Card>
      
      <Card style={{ background: '#f8fafc' }}>
        <h3 className="mb-2">AI Feedback <span style={{ fontSize:'0.8rem', padding:'0.2rem 0.5rem', background: '#e2e8f0', borderRadius: '4px' }}>Pending Submission</span></h3>
        <p className="text-secondary">Submit your answer to receive detailed feedback on clarity, confidence, and keyword usage.</p>
      </Card>
    </div>
  );
};
export default MockInterview;`,

  'Dashboard/StudyPlanner.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CheckSquare, Circle } from 'lucide-react';

const StudyPlanner = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Study Planner</h2>
        <Button>+ Add Task</Button>
      </div>
      
      <Card className="mb-6">
        <h3 className="mb-4">Today</h3>
        <div className="flex items-center justify-between p-4 mb-2 border rounded" style={{ borderColor: '#dfe1e6', border: '1px solid #dfe1e6', borderRadius: '8px' }}>
          <div className="flex items-center gap-4">
            <CheckSquare className="text-primary" />
            <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>Complete React basics tutorial</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border rounded" style={{ borderColor: '#dfe1e6', border: '1px solid #dfe1e6', borderRadius: '8px' }}>
          <div className="flex items-center gap-4">
            <Circle className="text-secondary" />
            <span>Solve 5 algorithm problems</span>
          </div>
          <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,127,0,0.1)', color: 'var(--color-accent)', borderRadius: '12px', fontSize: '0.85rem' }}>High Priority</span>
        </div>
      </Card>
    </div>
  );
};
export default StudyPlanner;`,

  'Dashboard/Resources.jsx': `
import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PlayCircle, FileText } from 'lucide-react';

const Resources = () => {
  return (
    <div>
      <h2 className="mb-6">Learning Resources</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div style={{ height: '160px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <PlayCircle size={48} className="text-primary" style={{ opacity: 0.5 }} />
          </div>
          <h3 className="card-title">Introduction to Web Dev</h3>
          <p className="mb-4 text-sm">A complete 2-hour crash course to get started.</p>
          <Button variant="outline" style={{width: '100%'}}>Watch Video</Button>
        </Card>
        
        <Card>
          <div style={{ height: '160px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <FileText size={48} className="text-primary" style={{ opacity: 0.5 }} />
          </div>
          <h3 className="card-title">Tech Interview Cheatsheet</h3>
          <p className="mb-4 text-sm">Downloadable PDF with most common questions.</p>
          <Button variant="outline" style={{width: '100%'}}>Download PDF</Button>
        </Card>
      </div>
    </div>
  );
};
export default Resources;`
};

Object.entries(files).forEach(([fPath, content]) => {
  const fullPath = path.join(pagesDir, fPath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Created:', fullPath);
});
