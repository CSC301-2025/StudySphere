package com.app.Course;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import com.app.Assignment.AssignmentEntity;
import com.app.Notes.NotesEntity;
import com.app.Grade.GradeEntity;


@Document(collection = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseEntity {
    @Id
    private String id;

    private String name;
    private String instructor;
    private String description;
    private String code;
    private String schedule;

    // Embedded collections
    private List<AssignmentEntity> assignments;
    private List<NotesEntity> notes;
    private List<GradeEntity> grades;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getInstructor() {
        return instructor;
    }

    public String getDescription() {
        return description;
    }

    public String getCode() {
        return code;
    }

    public String getSchedule() {
        return schedule;
    }

}
