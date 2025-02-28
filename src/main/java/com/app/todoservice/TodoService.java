package com.app.todoservice;

import org.springframework.stereotype.Service;

import com.app.Dto.TodoDto;

import java.util.List;

@Service
public class TodoService {
    
    // Todo repository containing all tasks
    private final TodoRepository todoRepository;


    // Constructor
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // Get todo by id
    public TodoEntity getTodoById(String id) {
        return todoRepository.findById(id).orElse(null);
    }

    // Get all todos
    public List<TodoEntity> getAllTodos() {
        return todoRepository.findAll();
    }

    // Get todos by section id
    public List<TodoEntity> getTodosBySectionID(String id) {
        return todoRepository.getTodosBySectionID(id).orElse(null);
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
    public TodoEntity savetodo(TodoDto dto) {

        // Create a new todo
        TodoEntity todo = new TodoEntity(dto.getDescription(), dto.getSectionID());

        return todoRepository.save(todo);
    }

    // Delete a todo from the database
    public void deletetodo(String id) {
        todoRepository.deleteById(id);
    }



}
