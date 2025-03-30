package com.app.Grade;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@NoArgsConstructor
public class GradeEntity {

    @Id
    private String id;

    private String assignmentName;
    private Double gradePercentage;
    private Double weightPercentage;

    public GradeEntity(String assignmentName, Double gradePercentage, Double weightPercentage) {
        this.assignmentName = assignmentName;
        this.gradePercentage = gradePercentage;
        this.weightPercentage = weightPercentage;
    }
}
