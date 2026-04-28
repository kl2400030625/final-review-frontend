import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { CheckCircle } from 'lucide-react';

const QUESTION_BANK_KEY = 'guidance_plus_questions_master';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const studentName = localStorage.getItem('studentName') || 'Student';

  useEffect(() => {
    // Load globally published admin question bank for all students.
    const saved = localStorage.getItem(QUESTION_BANK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
      } else {
        setQuestions([]);
      }
    } else {
      setQuestions([]);
    }

    // Load progress
    const progressSaved = localStorage.getItem('guidance_plus_progress');
    if (progressSaved) {
      setStep(parseInt(progressSaved, 10));
    }
    
    const savedAnswers = localStorage.getItem('guidance_plus_answers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const totalSteps = questions.length;
  const isCompleted = step > totalSteps && totalSteps > 0;
  
  if (totalSteps === 0) {
    return (
      <div>
        <h2 className="mb-4">Career Assessment</h2>
        <Card>
          <h3 className="mb-2">No assessment available right now</h3>
          <p className="text-secondary">Admin has not published assessment questions yet.</p>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    if (step === totalSteps) {
      const raw = localStorage.getItem('assessmentSubmissions');
      const submissions = raw ? JSON.parse(raw) : [];

      submissions.push({
        id: `assessment-${Date.now()}`,
        studentName,
        submittedAt: new Date().toISOString(),
        answers,
        questionSnapshot: questions,
      });

      localStorage.setItem('assessmentSubmissions', JSON.stringify(submissions));
    }

    const nextStep = step + 1;
    setStep(nextStep);
    localStorage.setItem('guidance_plus_progress', nextStep.toString());
    localStorage.setItem('guidance_plus_answers', JSON.stringify(answers));
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({});
    localStorage.removeItem('guidance_plus_progress');
    localStorage.removeItem('guidance_plus_answers');
  };

  if (isCompleted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CheckCircle size={64} className="text-primary mb-4" />
        <h2 className="mb-2">Assessment Complete!</h2>
        <p className="text-secondary text-center mb-6 max-w-md">You have completed all currently available assessment modules. If your administrator publishes new questions, they will automatically appear here!</p>
        <Button variant="outline" onClick={handleReset}>Retake Assessment</Button>
      </div>
    );
  }

  const currentQ = questions[step - 1];
  const progress = (step / totalSteps) * 100;

  return (
    <div>
      <h2 className="mb-4">Career Assessment</h2>
      <Card className="mb-8 p-6">
        <div className="mb-6 flex justify-between items-center">
          <span>Question {step} of {totalSteps}</span>
          <span className="text-primary font-medium">{Math.round(progress)}%</span>
        </div>
        <ProgressBar progress={progress} className="mb-8" />
        
        <div className="mb-8">
          <h3 className="mb-4">{currentQ?.q || 'Loading...'}</h3>
          <div className="flex-col gap-4">
            {currentQ?.options.map((opt, i) => (
              <label 
                key={i} 
                className="flex items-center gap-4 p-4 border rounded" 
                style={{ 
                   borderColor: answers[step] === i ? 'var(--color-primary)' : '#dfe1e6', 
                   background: answers[step] === i ? 'rgba(0,82,204,0.05)' : 'white',
                   cursor: 'pointer', 
                   borderRadius: '12px',
                   transition: 'all 0.2s'
                }}
              >
                <input 
                  type="radio" 
                  name={`q${step}`} 
                  value={i} 
                  checked={answers[step] === i}
                  onChange={() => setAnswers({...answers, [step]: i})}
                />
                <span style={{ fontWeight: 400 }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>Previous</Button>
          <Button onClick={handleNext} disabled={answers[step] === undefined}>
            {step === totalSteps ? 'Submit Assessment' : 'Next Question'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default Assessment;