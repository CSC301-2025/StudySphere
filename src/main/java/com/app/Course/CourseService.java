package com.app.Course;

import org.springframework.stereotype.Service;

import com.app.Assignment.AssignmentEntity;
import com.app.Notes.NoteEntity;
import com.app.Grade.GradeEntity;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
    // In case we need filtering for courses (still needs some changes)
    // public List<CourseEntity> getAllCourses(String name, String instructor, String description, String code, String schedule) {
    //     List<CourseEntity> courses = courseRepository.findAll();

    //     // Filter courses based on the provided criteria
    //     return courses.stream()
    //         .filter(course -> (name == null || course.getName().equalsIgnoreCase(name)) &&
    //                           (instructor == null || course.getInstructor().equalsIgnoreCase(instructor)) &&
    //                           (description == null || course.getDescription().equalsIgnoreCase(description)) &&
    //                           (code == null || course.getCode().equalsIgnoreCase(code)) &&
    //                           (schedule == null || course.getSchedule().equalsIgnoreCase(schedule)))
    //         .toList();
    // }

    public List<CourseEntity> getAllCourses() {
        List<CourseEntity> courses = courseRepository.findAll();
        return courses;
    }
    
    public Optional<CourseEntity> getCourseById(String id) {
        return courseRepository.findById(id);
    }
    
    public CourseEntity createCourse(CourseEntity course) {
        return courseRepository.save(course);
    }
    
    public CourseEntity updateCourse(CourseEntity course) {
        return courseRepository.save(course);
    }
    
    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
    
    public CourseEntity addAssignment(String courseId, AssignmentEntity assignment) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.getAssignments() != null) {
            course.getAssignments().add(assignment);
        } else {
            course.setAssignments(List.of(assignment));
        }
        return courseRepository.save(course);
    }
    
    public CourseEntity addNote(String courseId, NoteEntity note) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.getNotes() != null) {
            course.getNotes().add(note);
        } else {
            course.setNotes(List.of(note));
        }
        return courseRepository.save(course);
    }
    
    public CourseEntity addGrade(String courseId, GradeEntity grade) {
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
