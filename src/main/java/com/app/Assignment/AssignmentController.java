package com.app.Assignment;

import com.app.Dto.ApiResponse;
import com.app.Dto.AssignmentDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAllAssignments() {
        List<AssignmentDto> dtos = assignmentService.getAllAssignments().stream()
            .map(assignmentService::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Assignments retrieved", dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentDto>> getAssignment(@PathVariable String id) {
        AssignmentEntity assignment = assignmentService.getAssignmentById(id);
        if (assignment != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Assignment found", assignmentService.convertToDto(assignment)));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Assignment not found", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createAssignment(@Valid @RequestBody AssignmentDto assignmentDto) {
        try {
            assignmentService.createAssignment(assignmentDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Assignment created", null));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred during assignment creation.", null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateAssignment(@PathVariable String id, @Valid @RequestBody AssignmentDto assignmentDto) {
        AssignmentEntity updatedAssignment = assignmentService.updateAssignment(id, assignmentDto);
        if (updatedAssignment != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Assignment updated", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Assignment not found", null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAssignment(@PathVariable String id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Assignment deleted", null));
    }
}
