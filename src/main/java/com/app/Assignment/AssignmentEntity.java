package com.app.Assignment;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@Data
@NoArgsConstructor
public class AssignmentEntity {

    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    private Date dueDate;
    
    // true for recurring, false for non-recurring
    private boolean recurring;
    
    public AssignmentEntity(String name, String description, Date dueDate, boolean recurring) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.recurring = recurring;
    }
}
