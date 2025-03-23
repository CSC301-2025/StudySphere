package com.app.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.app.security.JWTGenerator;  // Assuming this exists in your project

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    // Instantiate JWTGenerator (or inject it if preferred)
    private JWTGenerator jwt = new JWTGenerator();

    @GetMapping
    public List<CalendarEvent> getEvents(@RequestHeader("Authorization") String token) {
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.getAllEvents(userID);
    }

    @PostMapping
    public CalendarEvent createEvent(@RequestHeader("Authorization") String token, @RequestBody CalendarEvent event) {
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.addEvent(userID, event);
    }

    @PutMapping("/{id}")
    public CalendarEvent updateEvent(@RequestHeader("Authorization") String token,
                                     @PathVariable String id,
                                     @RequestBody CalendarEvent event) {
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.updateEvent(userID, id, event);
    }

    @DeleteMapping("/{id}")
    public CalendarEvent deleteEvent(@RequestHeader("Authorization") String token, @PathVariable String id) {
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.removeEvent(userID, id);
    }
}
