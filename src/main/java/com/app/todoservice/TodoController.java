package com.app.todoservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.app.Dto.TodoDto;

import com.app.security.JWTGenerator;

@RestController
@RequestMapping("api/todo")
public class TodoController {
    
    // The todo service
    private final TodoService todoService;

    // JWT Generator
    JWTGenerator jwt;
    
    // Constructor to set the todoService
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
        this.jwt = new JWTGenerator();
    }

    // Get all todos
    @GetMapping
    public List<TodoEntity> getAllTodos(@RequestHeader("Authorization") String token) {
        String userID = jwt.getUserIdFromJWT(token);
        return todoService.getAllTodos(userID);
    }

    // Get todo by id
    @GetMapping("/{id}")
    public TodoEntity getTodo(@RequestHeader("Authorization") String token, @PathVariable String id) {
        String userID = jwt.getUserIdFromJWT(token);
        return todoService.getTodoById(userID, id);
    }

    // Get all todos by section id
    @GetMapping("/section/{id}")
    public List<TodoEntity> getTodosBySection(@RequestHeader("Authorization") String token, @PathVariable String id) {
        String userID = jwt.getUserIdFromJWT(token);
        return todoService.getTodosBySectionID(userID, id);
    }

    // Create a new todo
    @PostMapping
    public ResponseEntity<String> createTodo(@RequestHeader("Authorization") String token, @RequestBody TodoDto todoDto) {

        String userID = jwt.getUserIdFromJWT(token);

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
    public void deleteTodo(@RequestHeader("Authorization") String token, @PathVariable String id) {
        String userID = jwt.getUserIdFromJWT(token);
        todoService.deletetodo(userID, id);
    }

}
