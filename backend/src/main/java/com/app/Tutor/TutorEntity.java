package com.app.Tutor;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@NoArgsConstructor
public class TutorEntity {
    @Id
    private String userID;
    private List<String> student_id_list;
    private List<String> post_id_list;
    private List<String> review_id_list;

    // Constructor
    public TutorEntity(String userID, List<String> student_id_list, List<String> post_id_list, List<String> review_id_list) {
        this.userID = userID;
        this.student_id_list = student_id_list;
        this.post_id_list = post_id_list;
        this.review_id_list = review_id_list;
    }
}
