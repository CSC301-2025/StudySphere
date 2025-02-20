import React from 'react';

const Activities: React.FC = () => {
  return (
    <div style={styles.page}>
      <h2>Activities Page</h2>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    textAlign: 'center',
    marginTop: '50px',
  },
};

export default Activities;
