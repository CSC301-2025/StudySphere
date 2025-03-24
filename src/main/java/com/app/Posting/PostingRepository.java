package com.app.Posting;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PostingRepository extends MongoRepository<PostingEntity, String> {
    Optional<PostingEntity> getPostingEntityById(String id);
}
