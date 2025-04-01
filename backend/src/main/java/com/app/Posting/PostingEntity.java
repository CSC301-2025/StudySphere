package com.app.Posting;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class PostingEntity {
    @Id
    private String id;
    private String tutorId;
    private String title;
    private String[] coursesTaught;
    private String description;
    private String location; // online or in person
    private double pricePerHour;
    private String contactEmail; // retrieved from Tutor's record

    // No-argument constructor
    public PostingEntity() {}

    // Constructor with required fields (contactEmail is set later)
    public PostingEntity(String tutorId, String title, String[] coursesTaught, String description, String location, double pricePerHour) {
        this.tutorId = tutorId;
        this.title = title;
        this.coursesTaught = coursesTaught;
        this.description = description;
        this.location = location;
        this.pricePerHour = pricePerHour;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getTutorId() {
        return tutorId;
    }
    
    public void setTutorId(String tutorId) {
        this.tutorId = tutorId;
    }

    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public String[] getCoursesTaught() {
        return coursesTaught;
    }
    
    public void setCoursesTaught(String[] coursesTaught) {
        this.coursesTaught = coursesTaught;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }

    public double getPricePerHour() {
        return pricePerHour;
    }
    
    public void setPricePerHour(double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public String getContactEmail() {
        return contactEmail;
    }
    
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }
}
