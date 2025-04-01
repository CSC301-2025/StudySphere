
package com.app.Tutor;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TutorPostingRepository extends MongoRepository<TutorPostingEntity, String> {
    List<TutorPostingEntity> findByTutorId(String tutorId);
}
