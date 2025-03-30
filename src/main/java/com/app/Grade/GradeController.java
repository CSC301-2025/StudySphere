package com.app.Grade;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.ApiResponse;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GradeEntity>>> getAllGrades() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Grades retrieved", gradeService.getAllGrades()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeEntity>> getGrade(@PathVariable String id) {
        GradeEntity grade = gradeService.getGradeById(id);
        if(grade != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Grade found", grade));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse<>(false, "Grade not found", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GradeEntity>> createGrade(@Valid @RequestBody GradeEntity new_grade) {
        try {
            GradeEntity grade = gradeService.saveGrade(new_grade);
            return ResponseEntity.ok(new ApiResponse<>(true, "Grade created", grade));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "An error occurred while creating grade.", null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeEntity>> updateGrade(@PathVariable String id, @Valid @RequestBody GradeEntity new_grade) {
        try {
            GradeEntity grade = gradeService.updateGrade(id, new_grade);
            return ResponseEntity.ok(new ApiResponse<>(true, "Grade updated", grade));
        } catch(RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "An error occurred while updating grade.", null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteGrade(@PathVariable String id) {
        try {
            gradeService.deleteGrade(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Grade deleted", null));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "An error occurred while deleting grade.", null));
        }
    }
}
