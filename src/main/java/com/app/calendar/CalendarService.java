package com.app.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    public CalendarEvent addEvent(CalendarEvent event) {
        // Simply persist the event; MongoDB will handle id generation.
        return calendarRepository.save(event);
    }

    public CalendarEvent updateEvent(String id, CalendarEvent updatedEvent) {
        Optional<CalendarEvent> optionalEvent = calendarRepository.findById(id);
        if (optionalEvent.isPresent()){
            CalendarEvent existingEvent = optionalEvent.get();
            existingEvent.setTitle(updatedEvent.getTitle());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setEventDate(updatedEvent.getEventDate());
            return calendarRepository.save(existingEvent);
        }
        throw new NoSuchElementException("Event not found");
    }

    public CalendarEvent removeEvent(String id) {
        Optional<CalendarEvent> optionalEvent = calendarRepository.findById(id);
        if (optionalEvent.isPresent()){
            CalendarEvent event = optionalEvent.get();
            calendarRepository.deleteById(id);
            return event;
        }
        throw new NoSuchElementException("Event not found");
    }

    public List<CalendarEvent> getAllEvents() {
        return calendarRepository.findAll();
    }
}
