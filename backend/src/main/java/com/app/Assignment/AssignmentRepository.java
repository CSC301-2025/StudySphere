package com.app.Assignment;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface AssignmentRepository extends MongoRepository<AssignmentEntity, String> {
    // Additional custom query methods (if needed) can be defined here.

}