
package com.app.Course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<CourseEntity> getAllCoursesByUserId(String userId) {
        return courseRepository.findByUserId(userId);
    }

    public CourseEntity getCourseById(String id, String userId) {
        return courseRepository.findById(id)
                .filter(course -> course.getUserId().equals(userId))
                .orElse(null);
    }

    public CourseEntity saveCourse(CourseEntity course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }

    public AssignmentDto addAssignment(String courseId, AssignmentDto assignment, String userId) {
        CourseEntity course = getCourseById(courseId, userId);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }

        // Generate ID and set timestamps
        assignment.setId(UUID.randomUUID().toString());
        assignment.setCourseName(course.getName());

        course.getAssignments().add(assignment);
        courseRepository.save(course);
        return assignment;
    }

    public AssignmentDto toggleAssignmentStatus(String courseId, String assignmentId, String userId) {
        CourseEntity course = getCourseById(courseId, userId);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }

        AssignmentDto assignment = course.getAssignments().stream()
                .filter(a -> a.getId().equals(assignmentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignment.setSubmitted(!assignment.isSubmitted());
        courseRepository.save(course);
        return assignment;
    }

    public NoteDto addNote(String courseId, NoteDto note, String userId) {
        CourseEntity course = getCourseById(courseId, userId);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }

        // Generate ID and set timestamps
        note.setId(UUID.randomUUID().toString());
        note.setDateAdded(LocalDateTime.now().toString());

        course.getNotes().add(note);
        courseRepository.save(course);
        return note;
    }

    public GradeDto addGrade(String courseId, GradeDto grade, String userId) {
        CourseEntity course = getCourseById(courseId, userId);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }

        // Generate ID
        grade.setId(UUID.randomUUID().toString());

        course.getGrades().add(grade);
        courseRepository.save(course);
        return grade;
    }
}
