import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string; // ISO string
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: ''
  });

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = async () => {
    try {
      await axios.post('http://localhost:8080/api/events', newEvent);
      setNewEvent({ title: '', description: '', eventDate: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Calendar</h1>
      <section>
        <h2>Add Event</h2>
        <input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleInputChange}
          placeholder="Event Title"
          style={{ margin: '5px' }}
        />
        <input
          type="text"
          name="description"
          value={newEvent.description}
          onChange={handleInputChange}
          placeholder="Event Description"
          style={{ margin: '5px' }}
        />
        <input
          type="datetime-local"
          name="eventDate"
          value={newEvent.eventDate}
          onChange={handleInputChange}
          style={{ margin: '5px' }}
        />
        <button onClick={handleAddEvent} style={{ margin: '5px' }}>
          Add Event
        </button>
      </section>
      <section>
        <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>{new Date(event.eventDate).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CalendarPage;
