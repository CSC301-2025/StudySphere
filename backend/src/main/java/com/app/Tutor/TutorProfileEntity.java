
package com.app.Tutor;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "tutorProfiles")
@Data
@NoArgsConstructor
public class TutorProfileEntity {
    @Id
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String university;
    private String bio;
    private List<String> expertise;
    private String createdAt;
    
    public TutorProfileEntity(String userId, String firstName, String lastName, 
                             String email, String university, String bio, 
                             List<String> expertise) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.university = university;
        this.bio = bio;
        this.expertise = expertise;
        this.createdAt = java.time.Instant.now().toString();
    }
}
