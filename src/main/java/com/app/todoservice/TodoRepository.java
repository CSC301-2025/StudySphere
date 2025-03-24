package com.app.todoservice;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface TodoRepository extends MongoRepository<TodoEntity, String> {
    
    // Get a list of all the todos corresponding to the specified sectionID
    Optional<List<TodoEntity>> getTodosBySectionID(String userID, String sectionID);

    // Get a list of all the todos corresponding to the specified userID
    Optional<List<TodoEntity>> getTodosByUserID(String userID);

    // Get a todo by the specified id
    Optional<TodoEntity> getTodoByUserIDAndId(String userID, String id);
}
