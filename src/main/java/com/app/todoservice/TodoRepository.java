package com.app.todoservice;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface TodoRepository extends MongoRepository<TodoEntity, String> {
    
    // Get a list of all the todos corresponding to the specified sectionID
    Optional<List<TodoEntity>> getTodosBySectionID(String sectionID);
}
