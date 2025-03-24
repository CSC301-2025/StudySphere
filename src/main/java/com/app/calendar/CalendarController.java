package com.app.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping
    public List<CalendarEvent> getEvents() {
        return calendarService.getAllEvents();
    }

    @PostMapping
    public CalendarEvent createEvent(@RequestBody CalendarEvent event) {
        return calendarService.addEvent(event);
    }

    @PutMapping("/{id}")
    public CalendarEvent updateEvent(@PathVariable String id, @RequestBody CalendarEvent event) {
        return calendarService.updateEvent(id, event);
    }

    @DeleteMapping("/{id}")
    public CalendarEvent deleteEvent(@PathVariable String id) {
        return calendarService.removeEvent(id);
    }
}
