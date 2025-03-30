package com.app.todoservice;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document
@Data
@NoArgsConstructor
public class TodoEntity {
    @Id
    private String id;
    private String userID;
    private String description;
    private String sectionID;
    private boolean completed = false;
    private LocalDateTime dueDate;

    // Constructor
    public TodoEntity(String description, String userID, String sectionID) {
        this.description = description;
        this.userID = userID;
        this.sectionID = sectionID;
    }

    // Constructor with due date
    public TodoEntity(String description, String userID, String sectionID, LocalDateTime dueDate) {
        this.description = description;
        this.userID = userID;
        this.sectionID = sectionID;
        this.dueDate = dueDate;
    }

    // Get description
    public String getDescription() {
        return this.description;
    }

    // Set description
    public void setDescription(String description) {
        this.description = description;
    }

    // Get completed status
    public Boolean isCompleted() {
        return this.completed;
    }

    // Set completed status
    public void setCompleted(Boolean status) {
        this.completed = status;
    }

    // Get sectionID
    public String getSectionID() {
        return this.sectionID;
    }
    // Get due date
    public LocalDateTime getDueDate() {
        return this.dueDate;
    }

    // Set due date
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}
