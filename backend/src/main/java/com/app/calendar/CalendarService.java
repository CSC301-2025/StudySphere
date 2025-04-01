package com.app.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.ArrayList;

// import new for syncing
import com.app.todoservice.TodoEntity;  
import com.app.todoservice.TodoService;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    // This is so we can fill the calendar with todo events as well
    @Autowired
    private TodoService todoService;

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

    public List<CalendarEvent> syncTodosToCalendar(String userID) {
        // Fetch all ToDo events for this user.
        List<TodoEntity> todos = todoService.       
        getAllTodos(userID, LocalDateTime.MIN ,LocalDateTime.MAX);
        List<CalendarEvent> createdEvents = new ArrayList<>();
        
        if (todos != null) {
            for (TodoEntity todo : todos) {
                CalendarEvent event = new CalendarEvent();
                event.setUserID(userID);
                // For instance, use the todo's description as the event title.
                event.setTitle(todo.getDescription());
                // Optionally, use the sectionID or any other field for the description.
                event.setDescription("Todo from section: " + todo.getSectionID());
                // Use the todo's due date if available; otherwise, default to the current time.
                event.setEventDate(todo.getDueDate() != null ? todo.getDueDate() : LocalDateTime.now());
                createdEvents.add(calendarRepository.save(event));
            }
        }
        return createdEvents;
    }
}
