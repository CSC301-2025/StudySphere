package com.app.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    // Add event with userID: set the event's userID before saving
    public CalendarEvent addEvent(String userID, CalendarEvent event) {
        event.setUserID(userID);
        return calendarRepository.save(event);
    }

    // Update event: find the event by both userID and id
    public CalendarEvent updateEvent(String userID, String id, CalendarEvent updatedEvent) {
        Optional<CalendarEvent> optionalEvent = calendarRepository.getCalendarEventByUserIDAndId(userID, id);
        if (optionalEvent.isPresent()){
            CalendarEvent existingEvent = optionalEvent.get();
            existingEvent.setTitle(updatedEvent.getTitle());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setEventDate(updatedEvent.getEventDate());
            return calendarRepository.save(existingEvent);
        }
        throw new NoSuchElementException("Event not found");
    }

    // Remove event: ensure the event belongs to the user
    public CalendarEvent removeEvent(String userID, String id) {
        Optional<CalendarEvent> optionalEvent = calendarRepository.getCalendarEventByUserIDAndId(userID, id);
        if (optionalEvent.isPresent()){
            CalendarEvent event = optionalEvent.get();
            calendarRepository.deleteById(id);
            return event;
        }
        throw new NoSuchElementException("Event not found");
    }

    // Get all events for a given user
    public List<CalendarEvent> getAllEvents(String userID) {
        return calendarRepository.getCalendarEventsByUserID(userID).orElse(new ArrayList<>());
    }
}
