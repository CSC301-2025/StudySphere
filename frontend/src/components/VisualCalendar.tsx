import React from 'react';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string; // ISO string
}

interface VisualCalendarProps {
  events: Event[];
}

const VisualCalendar: React.FC<VisualCalendarProps> = ({ events }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed month

  // Generate all days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // Group events by day (using the string representation of the date)
  const eventsByDate: { [key: string]: Event[] } = {};
  events.forEach((event) => {
    const dateKey = new Date(event.eventDate).toDateString();
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  // Determine blank cells for days before the month starts
  const firstDayIndex = daysInMonth[0].getDay(); // 0 for Sunday, etc.
  const blanks = Array(firstDayIndex).fill(null);

  // Combine blanks and actual days into one array for the grid
  const calendarCells = [...blanks, ...daysInMonth];

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>
        Visual Calendar - {now.toLocaleString('default', { month: 'long' })} {currentYear}
      </h2>
      {/* Render the day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {day}
          </div>
        ))}
      </div>
      {/* Render the calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {calendarCells.map((cell, index) => {
          if (!cell) {
            return <div key={index} style={{ border: '1px solid #ccc', minHeight: '80px' }} />;
          }
          const dateKey = cell.toDateString();
          const dayEvents = eventsByDate[dateKey] || [];
          return (
            <div key={index} style={{ border: '1px solid #ccc', minHeight: '80px', padding: '5px' }}>
              <div style={{ fontWeight: 'bold' }}>{cell.getDate()}</div>
              {dayEvents.length > 0 && (
                <div style={{ fontSize: '0.8em' }}>
                  {dayEvents.map((ev) => (
                    <div key={ev.id} title={ev.title}>
                      {ev.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisualCalendar;
