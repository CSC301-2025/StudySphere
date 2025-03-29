package com.app.Assignment;

import com.app.Dto.AssignmentDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public List<AssignmentEntity> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public AssignmentEntity getAssignmentById(String id) {
        Optional<AssignmentEntity> assignmentOptional = assignmentRepository.findById(id);
        return assignmentOptional.orElse(null);
    }

    // Converts an AssignmentEntity to an AssignmentDto to be returned as a response.
    public AssignmentDto convertToDto(AssignmentEntity assignment) {
        AssignmentDto dto = new AssignmentDto();
        dto.setId(assignment.getId());
        dto.setName(assignment.getName());
        dto.setDescription(assignment.getDescription());
        dto.setDueDate(assignment.getDueDate());
        dto.setRecurring(assignment.isRecurring());
        return dto;
    }

    // Creates a new assignment using data from AssignmentDto.
    public AssignmentEntity createAssignment(AssignmentDto assignmentDto) {
        AssignmentEntity assignment = new AssignmentEntity(
                assignmentDto.getName(),
                assignmentDto.getDescription(),
                assignmentDto.getDueDate(),
                assignmentDto.isRecurring()
        );
        return assignmentRepository.save(assignment);
    }

    // Updates an existing assignment
    public AssignmentEntity updateAssignment(String id, AssignmentDto assignmentDto) {
        Optional<AssignmentEntity> existingAssignment = assignmentRepository.findById(id);
        if (existingAssignment.isPresent()) {
            AssignmentEntity updatedAssignment = existingAssignment.get();
            updatedAssignment.setName(assignmentDto.getName());
            updatedAssignment.setDescription(assignmentDto.getDescription());
            updatedAssignment.setDueDate(assignmentDto.getDueDate());
            updatedAssignment.setRecurring(assignmentDto.isRecurring());
            return assignmentRepository.save(updatedAssignment);
        }
        return null;
    }

    public void deleteAssignment(String id) {
        assignmentRepository.deleteById(id);
    }
}

