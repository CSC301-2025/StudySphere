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
    private String user_id;
    private List<String> student_id_list;
    private List<String> post_id_list;
    private List<String> review_id_list;

    // Constructor
    public TutorEntity(String user_id, List<String> student_id_list, List<String> post_id_list, List<String> review_id_list) {
        this.user_id = user_id;
        this.student_id_list = student_id_list;
        this.post_id_list = post_id_list;
        this.review_id_list = review_id_list;
    }

    // Getters and Setters
    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public List<String> getStudent_id_list() {
        return student_id_list;
    }

    public void setStudent_id_list(List<String> student_id_list) {
        this.student_id_list = student_id_list;
    }

    public List<String> getPost_id_list() {
        return post_id_list;
    }

    public void setPost_id_list(List<String> post_id_list) {
        this.post_id_list = post_id_list;
    }

    public List<String> getReview_id_list() {
        return review_id_list;
    }

    public void setReview_id_list(List<String> review_id_list) {
        this.review_id_list = review_id_list;
    }
}
