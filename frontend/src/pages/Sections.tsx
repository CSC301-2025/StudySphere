// src/pages/Sections.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sections: React.FC = () => {
  const [sections, setSections] = useState<string[]>([]);
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    setSections((prev) => [...prev, newSectionName.trim()]);
    setNewSectionName('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Sections</h2>

      <div style={styles.addSectionContainer}>
        <input
          type="text"
          placeholder="Enter section name (e.g. 'Biology')"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddSection} style={styles.addButton}>
          Add Section
        </button>
      </div>

      <div style={styles.coursePageContainer}>
        <Link to="/courses" style={{ textDecoration: 'none' }}>
          <button style={styles.sectionButton}>Go to Course Page</button>
        </Link>
      </div>

      <div style={styles.sectionsList}>
        {sections.map((section, index) => (
          <button key={index} style={styles.sectionButton}>
            {section}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sections;

const styles: { [key: string]: React.CSSProperties } = {
  /* 
    1) Make the container fill the viewport width.
    2) Use flex to center items horizontally (alignItems: 'center').
    3) Use marginTop or padding if you want space at the top.
  */
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',   // horizontally center all items
    justifyContent: 'flex-start',
    minHeight: '100vh',     // optional if you want a full screen container
    width: '100vw',
    paddingTop: '50px',
    boxSizing: 'border-box',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '1.8rem',
    color: '#ffffff',       // if you want white text on a dark background
  },
  addSectionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '8px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
  },
  addButton: {
    padding: '8px 16px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  coursePageContainer: {
    marginBottom: '20px',
  },
  sectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',  // ensures the newly added section buttons are centered
  },
  sectionButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    minWidth: '150px',
    textTransform: 'capitalize',
  },
};
