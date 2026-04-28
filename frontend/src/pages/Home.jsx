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
              <Link to="/login"><Button variant="accent" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started <ArrowRight size={20}/></Button></Link>
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
export default Home;