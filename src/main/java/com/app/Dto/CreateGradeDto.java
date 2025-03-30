package com.app.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateGradeDto {

    @NotBlank(message = "Assignment name is required")
    private String assignmentName;

    @NotNull(message = "Grade percentage is required")
    private Double gradePercentage;

    @NotNull(message = "Weight percentage is required")
    private Double weightPercentage;
}
