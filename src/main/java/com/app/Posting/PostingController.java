package com.app.Posting;

import com.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posting")
public class PostingController {

    private final Application application;

    @Autowired
    private PostingService postingService;

    PostingController(Application application) {
        this.application = application;
    }

    @GetMapping
    public ResponseEntity<List<PostingEntity>> getAllPosting( 
        @RequestParam(required = false) String title,
        @RequestParam(required = false) String course,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice) {
            
        List<PostingEntity> posting = postingService.getAllPosting();
        return new ResponseEntity<>(posting, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostingEntity> getPostingById(@PathVariable String id) {
        PostingEntity posting = postingService.getPostingById(id);
        if (posting != null) {
            return new ResponseEntity<>(posting, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPosting(@RequestBody PostingEntity posting) {
        try {
            PostingEntity createdPosting = postingService.createPosting(posting);
            return new ResponseEntity<>(createdPosting, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Return BAD_REQUEST if Tutor doesn't exist.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostingEntity> updatePosting(@PathVariable String id, @RequestBody PostingEntity posting) {
        try {
            PostingEntity updatedPosting = postingService.updatePosting(id, posting);
            return new ResponseEntity<>(updatedPosting, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosting(@PathVariable String id) {
        postingService.deletePosting(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
