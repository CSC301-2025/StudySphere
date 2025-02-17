package com.todoservice;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Task {
    @Id
    private String id;
    private String description;
    private String sectionID;
    private boolean completed;

    // Constructor
    public Task(String description, String sectionID) {
        this.description = description;
        this.sectionID = sectionID;
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
}
