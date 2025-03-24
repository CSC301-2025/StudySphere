import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <Link to="/calendar">
        <button style={styles.button}>Calendar</button>
      </Link>
      <Link to="/activities">
        <button style={styles.button}>Activities</button>
      </Link>
      <Link to="/todo">
        <button style={styles.button}>To Do List</button>
      </Link>
      <Link to="/courses">
        <button style={styles.button}>Course Page</button>
      </Link>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',    // centers horizontally within the container
    justifyContent: 'center', // centers vertically within the container
    height: '100vh',
    width: '100vw',           // ensures the container spans the full width of the viewport
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Dashboard;
