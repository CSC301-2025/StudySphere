package com.app.Notes;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface NotesRepository extends MongoRepository<NotesEntity, String> {

    Optional<NotesEntity> findByTitle(String title);

    Boolean existsByTitle(String title);
}
