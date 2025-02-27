package com.example.calendar.service;

import com.example.calendar.model.Event;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CalendarService {
    private Map<Long, Event> events = new HashMap<>();
    private AtomicLong idCounter = new AtomicLong();

    public Event addEvent(Event event) {
        long id = idCounter.incrementAndGet();
        event.setId(id);
        events.put(id, event);
        return event;
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        if (events.containsKey(id)) {
            updatedEvent.setId(id);
            events.put(id, updatedEvent);
            return updatedEvent;
        }
        throw new NoSuchElementException("Event not found");
    }

    public Event removeEvent(Long id) {
        return events.remove(id);
    }

    public List<Event> getAllEvents() {
        return new ArrayList<>(events.values());
    }
}
