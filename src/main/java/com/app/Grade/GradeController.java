package com.app.Grade;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.ApiResponse;
import com.app.Dto.CreateGradeDto;
import com.app.Dto.GradeDto;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GradeDto>>> getAllGrades() {
        List<GradeDto> dtos = gradeService.getAllGrades().stream()
            .map(gradeService::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Grades retrieved", dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeDto>> getGrade(@PathVariable String id) {
        GradeEntity grade = gradeService.getGradeById(id);
        if(grade != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Grade found", gradeService.convertToDto(grade)));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse<>(false, "Grade not found", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GradeDto>> createGrade(@Valid @RequestBody CreateGradeDto createGradeDto) {
        try {
            GradeEntity grade = gradeService.saveGrade(createGradeDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Grade created", gradeService.convertToDto(grade)));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "An error occurred while creating grade.", null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeDto>> updateGrade(@PathVariable String id, @Valid @RequestBody CreateGradeDto createGradeDto) {
        try {
            GradeEntity grade = gradeService.updateGrade(id, createGradeDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Grade updated", gradeService.convertToDto(grade)));
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
