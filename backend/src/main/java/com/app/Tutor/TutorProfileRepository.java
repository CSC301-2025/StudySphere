
package com.app.Tutor;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TutorProfileRepository extends MongoRepository<TutorProfileEntity, String> {
    Optional<TutorProfileEntity> findByUserId(String userId);
}
