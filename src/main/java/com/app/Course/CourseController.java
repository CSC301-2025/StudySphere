package com.app.Course;

import com.Application;
import com.app.security.JWTAuthenticationFilter;
import com.app.security.JWTGenerator;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/course")
public class CourseController {

    // JWT Generator
    @Autowired
    JWTGenerator jwt;

    @Autowired
    private CourseService courseService;

    CourseController(Application application) {
        this.application = application;
    }

    @GetMapping
    public ResponseEntity<?> getAllCourse( 
        @RequestParam(required = false) String title,
        @RequestParam(required = false) String course,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice) {
        
        // Verify if title is passed, it is not empty
        if (title != null && title.isEmpty()) {
            return new ResponseEntity<>("Title must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if course is passed, it is not empty
        if (course != null && course.isEmpty()) {
            return new ResponseEntity<>("Course must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if location is passed, it is not empty
        if (location != null && !(location.equals("Online") || location.equals("In-Person"))) {
            return new ResponseEntity<>("Location must be either 'Online' or 'In-Person'", HttpStatus.BAD_REQUEST);
        }

        // Verify if minPrice is passed, it is not negative
        if (minPrice != null && minPrice < 0) {
            return new ResponseEntity<>("Min Price must not be negative", HttpStatus.BAD_REQUEST);
        }

        // Verify if maxPrice is passed, it is not negative, and that it is greater than min price (if applicable)
        if (maxPrice != null && ((maxPrice < 0) || (minPrice != null && maxPrice < minPrice))) {
            return new ResponseEntity<>("Max Price must not be negative and be greater than Min Price", HttpStatus.BAD_REQUEST);
        }
        
        List<CourseEntity> course = courseService.getAllCourse(title, course, location, minPrice, maxPrice);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseEntity> getCourseById(@PathVariable String id) {
        CourseEntity course = courseService.getCourseById(id);
        if (course != null) {
            return new ResponseEntity<>(course, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
            CourseEntity updatedCourse = courseService.updateCourse(id, course);
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
