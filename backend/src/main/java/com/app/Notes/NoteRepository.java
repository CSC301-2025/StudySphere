package com.app.Notes;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface NoteRepository extends MongoRepository<NoteEntity, String> {

    Optional<NoteEntity> findByTitle(String title);

    Boolean existsByTitle(String title);
}
