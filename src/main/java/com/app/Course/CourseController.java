package com.app.Course;

import com.app.security.JWTGenerator;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import static org.mockito.Mockito.description;

import java.util.List;


@RestController
@RequestMapping("/api/course")
public class CourseController {

    // JWT Generator
    @Autowired
    JWTGenerator jwt;

    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCourse( 
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String instructor,
        @RequestParam(required = false) String description,
        @RequestParam(required = false) String code,
        @RequestParam(required = false) String schedule) {
        
        // Verify if title is passed, it is not empty
        if (name != null && name.isEmpty()) {
            return new ResponseEntity<>("Name must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if title is passed, it is not empty
        if (instructor != null && instructor.isEmpty()) {
            return new ResponseEntity<>("Instructor must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if title is passed, it is not empty
        if (description != null && description.isEmpty()) {
            return new ResponseEntity<>("Description must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if title is passed, it is not empty
        if (code != null && code.isEmpty()) {
            return new ResponseEntity<>("Code must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if title is passed, it is not empty
        if (schedule != null && schedule.isEmpty()) {
            return new ResponseEntity<>("Schedule must not be empty", HttpStatus.BAD_REQUEST);
        }
        
        List<CourseEntity> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseEntity> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id)
        .map(course -> new ResponseEntity<>(course, HttpStatus.OK))
        .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createCourse(HttpServletRequest request, @RequestBody CourseEntity course) {
        try {
            CourseEntity createdCourse = courseService.createCourse(course);

            return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Return BAD_REQUEST if Tutor doesn't exist.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseEntity> updateCourse(@PathVariable String id, @RequestBody CourseEntity course) {
        try {
            CourseEntity updatedCourse = courseService.updateCourse(course); // changed
            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
