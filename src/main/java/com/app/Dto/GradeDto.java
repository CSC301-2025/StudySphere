package com.app.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GradeDto {

    private String id;
    private String assignmentName;
    private Double gradePercentage;
    private Double weightPercentage;
}
