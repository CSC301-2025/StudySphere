import React from 'react';

const Todo: React.FC = () => {
  return (
    <div style={styles.page}>
      <h2>To Do List Page</h2>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    textAlign: 'center',
    marginTop: '50px',
  },
};

export default Todo;
