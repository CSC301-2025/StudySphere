
package com.app.Course;

import com.app.security.JWTAuthenticationFilter;
import com.app.security.JWTGenerator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private JWTGenerator jwtGenerator;

    @GetMapping
    public ResponseEntity<List<CourseEntity>> getAllCourses(HttpServletRequest request) {
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            List<CourseEntity> courses = courseService.getAllCoursesByUserId(userId);
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseEntity> getCourseById(@PathVariable String id, HttpServletRequest request) {
        System.out.println("Course Id: " + id);
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            CourseEntity course = courseService.getCourseById(id, userId);
            System.out.println("Found Course: " + course);
            if (course != null) {
                return new ResponseEntity<>(course, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping
    public ResponseEntity<CourseEntity> createCourse(@RequestBody CourseEntity course, HttpServletRequest request) {
        System.out.println("New Course: " + course);
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            course.setUserId(userId);
            CourseEntity savedCourse = courseService.saveCourse(course);
            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseEntity> updateCourse(@PathVariable String id, @RequestBody CourseEntity course, HttpServletRequest request) {
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            CourseEntity existingCourse = courseService.getCourseById(id, userId);
            if (existingCourse == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            course.setId(id);
            course.setUserId(userId);
            CourseEntity updatedCourse = courseService.saveCourse(course);
            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id, HttpServletRequest request) {
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            CourseEntity course = courseService.getCourseById(id, userId);
            if (course == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            courseService.deleteCourse(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    // Assignment endpoints
    @PostMapping("/{courseId}/assignments")
    public ResponseEntity<AssignmentDto> addAssignment(@PathVariable String courseId, @RequestBody AssignmentDto assignment, HttpServletRequest request) {
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            AssignmentDto savedAssignment = courseService.addAssignment(courseId, assignment, userId);
            return new ResponseEntity<>(savedAssignment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{courseId}/assignments/{assignmentId}/toggle")
    public ResponseEntity<AssignmentDto> toggleAssignmentStatus(@PathVariable String courseId, @PathVariable String assignmentId, HttpServletRequest request) {
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            AssignmentDto updatedAssignment = courseService.toggleAssignmentStatus(courseId, assignmentId, userId);
            return new ResponseEntity<>(updatedAssignment, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Notes endpoints
    @PostMapping("/{courseId}/notes")
    public ResponseEntity<NoteDto> addNote(@PathVariable String courseId, @RequestBody NoteDto note, HttpServletRequest request) {
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            NoteDto savedNote = courseService.addNote(courseId, note, userId);
            return new ResponseEntity<>(savedNote, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Grades endpoints
    @PostMapping("/{courseId}/grades")
    public ResponseEntity<GradeDto> addGrade(@PathVariable String courseId, @RequestBody GradeDto grade, HttpServletRequest request) {
        try {
            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userId = jwtGenerator.getUserIdFromJWT(token);
            GradeDto savedGrade = courseService.addGrade(courseId, grade, userId);
            return new ResponseEntity<>(savedGrade, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
