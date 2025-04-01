package com.app.todoservice;

import org.springframework.stereotype.Service;

import com.app.Dto.TodoDto;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TodoService {
    
    // Todo repository containing all tasks
    private final TodoRepository todoRepository;


    // Constructor
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // Get todo by id
    public TodoEntity getTodoById(String userID, String id) {
        return todoRepository.getTodoByUserIDAndId(userID, id).orElse(null);
    }

    // Get all todos
    public List<TodoEntity> getAllTodos(String userID, LocalDateTime startDate, LocalDateTime endDate) {
        List<TodoEntity> todos = todoRepository.getTodosByUserID(userID).orElse(null);

        // Apply filtering for dates (if provided)
        return todos.stream()
            .filter(todo -> (startDate == null || !todo.getDueDate().isBefore(startDate)))
            .filter(todo -> (endDate == null || !todo.getDueDate().isAfter(endDate)))
            .collect(Collectors.toList());
    }

    // Get todos by section id
    public List<TodoEntity> getTodosBySectionID(String userID, String id, LocalDateTime startDate, LocalDateTime endDate) {
        List<TodoEntity> todos = todoRepository.getTodosByUserIDAndSectionID(userID, id).orElse(null);

        // Apply filtering for dates (if provided)
        return todos.stream()
        .filter(todo -> (startDate == null || !todo.getDueDate().isBefore(startDate)))
        .filter(todo -> (endDate == null || !todo.getDueDate().isAfter(endDate)))
        .collect(Collectors.toList());
    }

    // Convert a TodoEntity to a TodoDto that is returned to the client as a response
    public TodoDto convertToDto(TodoEntity todo) {

        // Initialize the Dto
        TodoDto dto = new TodoDto();

        // Set all attributes
        dto.setId(todo.getId());
        dto.setDescription(todo.getDescription());
        dto.setSectionID(todo.getSectionID());
        dto.setCompleted(todo.isCompleted());

        // Return the Dto
        return dto;
    }

    // Save a new todo to the database
    public TodoEntity savetodo(String userID, TodoDto dto) {

        // Declare todo entity
        TodoEntity todo;

        // If due date was passed, initialize it with the due date, otherwise create it without
        if (dto.getDueDate() != null) {
            todo = new TodoEntity(dto.getDescription(), userID, dto.getSectionID(), dto.getDueDate());
        }
        else {
            todo = new TodoEntity(dto.getDescription(), userID, dto.getSectionID());
        }

        return todoRepository.save(todo);
    }

    // Delete a todo from the database
    public void deletetodo(String userID, String id) {

        Optional<TodoEntity> todo = todoRepository.getTodoByUserIDAndId(userID, id);

        if(todo.isPresent()) {
            todoRepository.delete(todo.get());
        }
        
    }



}
