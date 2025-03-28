package com.app.calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.app.security.JWTGenerator;  // Assuming this exists in your project
import com.app.security.JWTAuthenticationFilter;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    // Instantiate JWTGenerator (or inject it if preferred)
    private JWTGenerator jwt = new JWTGenerator();

    @GetMapping
    public List<CalendarEvent> getEvents(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        
        return calendarService.getAllEvents(userID);
    }

    @PostMapping
    public CalendarEvent createEvent(HttpServletRequest request, @RequestBody CalendarEvent event) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.addEvent(userID, event);
    }

    @PutMapping("/{id}")
    public CalendarEvent updateEvent(HttpServletRequest request,
                                     @PathVariable String id,
                                     @RequestBody CalendarEvent event) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.updateEvent(userID, id, event);
    }

    @DeleteMapping("/{id}")
    public CalendarEvent deleteEvent(HttpServletRequest request, @PathVariable String id) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.removeEvent(userID, id);
    }

    @PostMapping("/sync")
    public List<CalendarEvent> syncTodos(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return calendarService.syncTodosToCalendar(userID);
    }
}
