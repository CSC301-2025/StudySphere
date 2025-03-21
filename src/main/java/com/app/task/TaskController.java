package com.app.task;

import com.app.calendar.CalendarEvent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private RestTemplate restTemplate;

    // URL of the calendar microservice; in production, use service discovery or configuration
    private final String CALENDAR_SERVICE_URL = "http://localhost:8080/api/events";

    @PostMapping
    public ResponseEntity<String> createTask(@RequestBody TaskRequest taskRequest) {
        // Logic to create the task (e.g., saving to a database) would go here.
        // Immediately create a corresponding calendar event:
        CalendarEvent event = new CalendarEvent();
        event.setTitle("Task: " + taskRequest.getTitle());
        event.setDescription(taskRequest.getDescription());
        // Use the task due date as the event date
        event.setEventDate(taskRequest.getDueDate() != null ? taskRequest.getDueDate() : LocalDateTime.now());
        
        // Call the calendar microservice to create an event
        ResponseEntity<CalendarEvent> response = restTemplate.postForEntity(CALENDAR_SERVICE_URL, event, CalendarEvent.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.ok("Task and calendar event created successfully!");
        } else {
            return ResponseEntity.status(response.getStatusCode()).body("Task created, but failed to create calendar event.");
        }
    }
}
