package com.app.todoservice;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface TodoRepository extends MongoRepository<TodoEntity, Long> {
    
    // Get a list of all the todos corresponding to the specified sectionID
    Optional<List<TodoEntity>> getTodosBySectionID(Long sectionID);
}
