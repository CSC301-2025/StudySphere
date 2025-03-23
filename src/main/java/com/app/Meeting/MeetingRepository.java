package com.app.Meeting;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface MeetingRepository extends MongoRepository<MeetingEntity, String> {
    Optional<MeetingEntity> getMeetingEntityById(String id);
}
