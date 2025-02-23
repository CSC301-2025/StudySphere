import React from 'react';

const Calendar: React.FC = () => {
  return (
    <div style={styles.page}>
      <h2>Calendar Page</h2>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    textAlign: 'center',
    marginTop: '50px',
  },
};

export default Calendar;
