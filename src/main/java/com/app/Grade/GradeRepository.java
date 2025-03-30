package com.app.Grade;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface GradeRepository extends MongoRepository<GradeEntity, String> {
    // You can add custom query methods if needed
}
