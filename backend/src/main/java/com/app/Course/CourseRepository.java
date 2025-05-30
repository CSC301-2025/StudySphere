
package com.app.Course;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends MongoRepository<CourseEntity, String> {
    List<CourseEntity> findByUserId(String userId);
}
