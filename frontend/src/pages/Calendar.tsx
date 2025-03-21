import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import VisualCalendar from '../components/VisualCalendar.tsx';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string; // ISO string
}

// Define the light theme (white & purple)
const lightTheme = {
  pageWrapper: {
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  headerBar: {
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    margin: 0,
    color: '#333333',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666666',
    marginTop: '0.5rem',
    lineHeight: 1.4,
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1.5rem',
  },
  actionButton: {
    backgroundColor: 'transparent',
    color: '#333333',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  primaryButton: {
    backgroundColor: 'purple',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  sectionHeading: {
    fontSize: '1.25rem',
    margin: '1.5rem 0 1rem',
    fontWeight: 500,
    color: '#333333',
  },
  formWrapper: {
    backgroundColor: '#f7f7f7',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    flex: '1 1 220px',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  eventList: {
    listStyle: 'none',
    padding: 0,
  },
  eventItem: {
    backgroundColor: '#f7f7f7',
    marginBottom: '1rem',
    padding: '1rem',
    borderRadius: '8px',
  },
  eventTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.3rem',
    color: '#333333',
  },
  eventDescription: {
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
    color: '#666666',
  },
  eventDate: {
    fontSize: '0.8rem',
    color: '#999999',
  },
};

// Define the dark theme (black & purple)
const darkTheme = {
  pageWrapper: {
    backgroundColor: '#1f1f1f',
    color: '#e0e0e0',
  },
  headerBar: {
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    margin: 0,
    color: '#e0e0e0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#9e9e9e',
    marginTop: '0.5rem',
    lineHeight: 1.4,
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1.5rem',
  },
  actionButton: {
    backgroundColor: 'transparent',
    color: '#e0e0e0',
    border: '1px solid #3c3c3c',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  primaryButton: {
    backgroundColor: '#3c3c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  sectionHeading: {
    fontSize: '1.25rem',
    margin: '1.5rem 0 1rem',
    fontWeight: 500,
    color: '#e0e0e0',
  },
  formWrapper: {
    backgroundColor: '#2c2c2c',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    flex: '1 1 220px',
    padding: '0.5rem',
    border: '1px solid #3c3c3c',
    borderRadius: '4px',
    backgroundColor: '#1f1f1f',
    color: '#e0e0e0',
  },
  eventList: {
    listStyle: 'none',
    padding: 0,
  },
  eventItem: {
    backgroundColor: '#2c2c2c',
    marginBottom: '1rem',
    padding: '1rem',
    borderRadius: '8px',
  },
  eventTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.3rem',
    color: '#e0e0e0',
  },
  eventDescription: {
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
    color: '#ccc',
  },
  eventDate: {
    fontSize: '0.8rem',
    color: '#888',
  },
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
  });
  const [showNewEventForm, setShowNewEventForm] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Fetch events when component mounts.
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<Event[]>('http://localhost:8080/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      await axios.post('http://localhost:8080/api/events', newEvent);
      setNewEvent({ title: '', description: '', eventDate: '' });
      setShowNewEventForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Determine current theme
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <div style={{ ...theme.pageWrapper, width: '100vw', minHeight: '100vh', padding: '2rem' }}>
      {/* Theme toggle button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button style={theme.primaryButton} onClick={toggleTheme}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Top Section: Title, Subtitle, and Actions */}
      <div style={theme.headerBar}>
        <h1 style={theme.pageTitle}>Course Schedule</h1>
        <p style={theme.subtitle}>
          This course schedule provides a thorough list of weekly topics, readings,
          assignments, and exams. You can create your own categories and topics for
          whatever you’re teaching. More on that here.
        </p>
        <div style={theme.topActions}>
          <button
            style={theme.primaryButton}
            onClick={() => setShowNewEventForm(!showNewEventForm)}
          >
            New
          </button>
        </div>
      </div>

      {/* "Add Event" Form */}
      {showNewEventForm && (
        <div style={theme.formWrapper}>
          <h2 style={theme.sectionHeading}>Add Event</h2>
          <div style={theme.formRow}>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Event Title"
              style={theme.input}
            />
            <input
              type="text"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Event Description"
              style={theme.input}
            />
            <input
              type="datetime-local"
              name="eventDate"
              value={newEvent.eventDate}
              onChange={handleInputChange}
              style={theme.input}
            />
          </div>
          <button style={theme.primaryButton} onClick={handleAddEvent}>
            Add Event
          </button>
        </div>
      )}

      {/* Events List */}
      <h2 style={theme.sectionHeading}>Events</h2>
      {events.length === 0 ? (
        <p style={{ color: isDarkMode ? '#888' : '#666' }}>No events found.</p>
      ) : (
        <ul style={theme.eventList}>
          {events.map((event) => (
            <li key={event.id} style={theme.eventItem}>
              <h3 style={theme.eventTitle}>{event.title}</h3>
              <p style={theme.eventDescription}>{event.description}</p>
              <p style={theme.eventDate}>
                {new Date(event.eventDate).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Visual Calendar */}
      <VisualCalendar events={events} isDarkMode={isDarkMode} theme={theme} />
    </div>
  );
};

export default CalendarPage;
