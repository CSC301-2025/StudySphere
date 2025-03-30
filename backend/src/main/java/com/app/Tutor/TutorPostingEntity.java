
package com.app.Tutor;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "tutorPostings")
@Data
@NoArgsConstructor
public class TutorPostingEntity {
    @Id
    private String id;
    private String tutorId;
    private String title;
    private List<String> coursesTaught;
    private String description;
    private String location;
    private double pricePerHour;
    private String contactEmail;
    private String university;
    
    public TutorPostingEntity(String tutorId, String title, List<String> coursesTaught,
                             String description, String location, double pricePerHour,
                             String contactEmail, String university) {
        this.tutorId = tutorId;
        this.title = title;
        this.coursesTaught = coursesTaught;
        this.description = description;
        this.location = location;
        this.pricePerHour = pricePerHour;
        this.contactEmail = contactEmail;
        this.university = university;
    }
}
