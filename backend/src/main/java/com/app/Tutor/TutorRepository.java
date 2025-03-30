package com.app.Tutor;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TutorRepository extends MongoRepository<TutorEntity, String> {
}