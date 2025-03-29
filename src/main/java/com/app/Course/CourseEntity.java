package com.app.Course;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

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
    private List<Assignment> assignments;
    private List<Note> notes;
    private List<Grade> grades;
}
