package com.app.Course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
    @Override
    public List<CourseEntity> getAllCourses() {
        return courseRepository.findAll();
    }
    
    @Override
    public Optional<CourseEntity> getCourseById(String id) {
        return courseRepository.findById(id);
    }
    
    @Override
    public CourseEntity createCourse(CourseEntity course) {
        return courseRepository.save(course);
    }
    
    @Override
    public CourseEntity updateCourse(CourseEntity course) {
        return courseRepository.save(course);
    }
    
    @Override
    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
    
    @Override
    public CourseEntity addAssignment(String courseId, Assignment assignment) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.getAssignments() != null) {
            course.getAssignments().add(assignment);
        } else {
            course.setAssignments(List.of(assignment));
        }
        return courseRepository.save(course);
    }
    
    @Override
    public CourseEntity addNote(String courseId, Note note) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.getNotes() != null) {
            course.getNotes().add(note);
        } else {
            course.setNotes(List.of(note));
        }
        return courseRepository.save(course);
    }
    
    @Override
    public CourseEntity addGrade(String courseId, Grade grade) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.getGrades() != null) {
            course.getGrades().add(grade);
        } else {
            course.setGrades(List.of(grade));
        }
        return courseRepository.save(course);
    }
}
