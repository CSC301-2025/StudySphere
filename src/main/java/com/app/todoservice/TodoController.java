package com.app.todoservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import com.app.Dto.TodoDto;
import com.app.Section.SectionEntity;
import com.app.security.JWTGenerator;
import com.app.security.JWTAuthenticationFilter;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/todo")
public class TodoController {
    
    // The todo service
    private final TodoService todoService;

    // JWT Generator
    JWTGenerator jwt;
    
    // Constructor to set the todoService
    public TodoController(TodoService todoService, JWTGenerator jwt) {
        this.todoService = todoService;
        this.jwt = jwt;
    }

    // Get all todos
    @GetMapping
    public List<TodoEntity> getAllTodos(
        HttpServletRequest request,
        @RequestParam(required = false) String sectionID,
        @RequestParam(required = false) String startDate,
        @RequestParam(required = false) String endDate) {

        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);

        LocalDateTime start = null;
        LocalDateTime end = null;

        // Parse startDate if provided
        if (startDate != null) {
            try {
                start = LocalDateTime.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            } catch (DateTimeParseException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid startDate format. Expected: yyyy-MM-dd'T'HH:mm:ss");
            }
        }

        // Parse endDate if provided
        if (endDate != null) {
            try {
                end = LocalDateTime.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            } catch (DateTimeParseException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid endDate format. Expected: yyyy-MM-dd'T'HH:mm:ss");
            }
        }

        // Get all todos by section if specified
        if (sectionID != null) {
            return todoService.getTodosBySectionID(userID, sectionID, start, end);
        }

        // Otherwise get all todos for the user
        else {
            return todoService.getAllTodos(userID, start, end);
        }

    }

    // Get todo by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getTodo(HttpServletRequest request, @PathVariable String id) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        
        // Retrieve todo
        TodoEntity todo = todoService.getTodoById(userID, id);
        
        if (todo == null) {
            return new ResponseEntity<>("Todo not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(todo, HttpStatus.OK);
    }

    // Create a new todo
    @PostMapping
    public ResponseEntity<String> createTodo(HttpServletRequest request, @RequestBody TodoDto todoDto) {

        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);

        // Error check description
        if (todoDto.getDescription() == null || todoDto.getDueDate() == null || todoDto.getSectionID() == null) {
            return new ResponseEntity<>("Todo missing required parameters", HttpStatus.BAD_REQUEST);
        }

        // Save todo entity to database
        TodoEntity todo = todoService.savetodo(userID, todoDto);

        // Check if todo task was created successfully
        if (todo != null) {
            return new ResponseEntity<>("Task Created", HttpStatus.OK);
        }

        // Otherwise, error
        return new ResponseEntity<>("Failed to create task", HttpStatus.BAD_REQUEST);
    }

    // Delete a task (if it exists)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodo(HttpServletRequest request, @PathVariable String id) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);

        // Retrieve todo
        TodoEntity todo = todoService.getTodoById(userID, id);

        if (todo == null) {
            return new ResponseEntity<>("Could not find requested todo", HttpStatus.NOT_FOUND);
        }
        else {
            todoService.deletetodo(userID, id);
            return new ResponseEntity<>("Successfully deleted todo", HttpStatus.OK);
        }

        
    }

}

