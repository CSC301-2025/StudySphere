package com.app.Section;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SectionRepository extends MongoRepository<SectionEntity, String> {

    // Get a list of all the Sections corresponding to the specified sectionID
    Optional<SectionEntity> findByUserIDAndSectionId(String userID, String sectionID);

    // Get a list of all the todos corresponding to the specified userID
    Optional<List<SectionEntity>> getSectionsByUserID(String userID);
}