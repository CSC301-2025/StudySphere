// src/pages/CoursePage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CoursePage.css';

type Tab = 'notes' | 'assignments' | 'materials';

const CoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('notes');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return <div className="tab-content">📝 Here are your course notes.</div>;
      case 'assignments':
        return <div className="tab-content">📚 Your upcoming assignments.</div>;
      case 'materials':
        return <div className="tab-content">📂 Study materials & resources.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="course-page">
      <header className="course-header">
        <h1>📖 Course Dashboard</h1>
        <nav>
          {/* Existing Home link */}
          <Link to="/" className="back-home">🏠 Home</Link>
          {/* New To-Do link */}
          <Link to="/todo" className="back-home">📝 To-Do List</Link>
          {/* New Calendar link */}
          <Link to="/calendar" className="back-home">📅 Calendar</Link>
        </nav>
      </header>
      

      <div className="course-banner">
        <h2>Welcome to your Course!</h2>
        <p>Stay on top of your studies with notes, assignments, and study materials.</p>
      </div>

      <nav className="course-tabs">
        <button
          onClick={() => setActiveTab('notes')}
          className={activeTab === 'notes' ? 'active' : ''}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={activeTab === 'assignments' ? 'active' : ''}
        >
          Assignments
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={activeTab === 'materials' ? 'active' : ''}
        >
          Study Materials
        </button>
      </nav>

      <section className="course-content">
        {renderTabContent()}
      </section>
    </div>
  );
};

export default CoursePage;
