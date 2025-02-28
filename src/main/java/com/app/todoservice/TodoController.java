package com.app.todoservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.app.Dto.TodoDto;

@RestController
@RequestMapping("api/todo")
public class TodoController {
    
    // The todo service
    private final TodoService todoService;

    
    // Constructor to set the todoService
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // Get all todos
    @GetMapping
    public List<TodoEntity> getAllTodos() {
        return todoService.getAllTodos();
    }

    // Get todo by id
    @GetMapping("/{id}")
    public TodoEntity getTodo(@PathVariable String id) {
        return todoService.getTodoById(id);
    }

    // Get all todos by section id
    @GetMapping("/section/{id}")
    public List<TodoEntity> getTodosBySection(@PathVariable String id) {
        return todoService.getTodosBySectionID(id);
    }

    // Create a new todo
    @PostMapping("/create")
    public ResponseEntity<String> createTodo(@RequestBody TodoDto todoDto) {

        // Save todo entity to database
        TodoEntity todo = todoService.savetodo(todoDto);

        // Check if todo task was created successfully
        if (todo != null) {
            return new ResponseEntity<>("Task Created", HttpStatus.OK);
        }

        // Otherwise, error
        return new ResponseEntity<>("Failed to create task", HttpStatus.BAD_REQUEST);
    }

    // Delete a task (if it exists)
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable String id) {
        todoService.deletetodo(id);
    }

}
