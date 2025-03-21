package com.app.Tutor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;

import java.util.List;

@RestController
@RequestMapping("api/Tutor")
public class TutorController {
    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;

    }

    // get request to get all tutors
    @GetMapping
    public List<TutorEntity> getAllTutors() {
        return tutorService.getAllTutors();
    }

    // get request to get a tutor by id
    @GetMapping("/{id}")
    public TutorEntity getTutorById(@PathVariable String id) {
        return tutorService.getTutorById(id);
    }

    // post request to add a tutor
    @PostMapping
    public ResponseEntity<TutorEntity> addTutor(@RequestBody TutorDto tutorDto) {
        return new ResponseEntity<>(tutorService.addTutor(tutorDto), HttpStatus.CREATED);
    }

    // put request to update a tutor
    @PatchMapping
    public ResponseEntity<TutorEntity> updateTutor(@RequestBody TutorDto tutorDto) {
        return new ResponseEntity<>(tutorService.updateTutor(tutorDto), HttpStatus.OK);
    }

    // delete request to delete a tutor
    @DeleteMapping("/{id}")
    public void deleteTutor(@PathVariable String id) {
        tutorService.deleteTutor(id);
    }

}
