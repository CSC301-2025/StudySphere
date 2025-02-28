package com.example.calendar.controller;

import com.example.calendar.model.Event;
import com.example.calendar.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping
    public List<Event> getEvents() {
        return calendarService.getAllEvents();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return calendarService.addEvent(event);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return calendarService.updateEvent(id, event);
    }

    @DeleteMapping("/{id}")
    public Event deleteEvent(@PathVariable Long id) {
        return calendarService.removeEvent(id);
    }
}
