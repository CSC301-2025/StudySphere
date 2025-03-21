package com.app.Tutor;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TutorRepository extends MongoRepository<TutorEntity, String> {

}