package com.app.Grade;

import com.app.Dto.CreateGradeDto;
import com.app.Dto.GradeDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public List<GradeEntity> getAllGrades() {
        return gradeRepository.findAll();
    }

    public GradeEntity getGradeById(String id) {
        return gradeRepository.findById(id).orElse(null);
    }

    /**
     * Converts a GradeEntity to a GradeDto to be returned in responses.
     */
    public GradeDto convertToDto(GradeEntity grade) {
        GradeDto dto = new GradeDto();
        dto.setId(grade.getId());
        dto.setAssignmentName(grade.getAssignmentName());
        dto.setGradePercentage(grade.getGradePercentage());
        dto.setWeightPercentage(grade.getWeightPercentage());
        return dto;
    }

    /**
     * Saves a new grade to the database.
     */
    public GradeEntity saveGrade(CreateGradeDto createGradeDto) {
        GradeEntity grade = new GradeEntity(
            createGradeDto.getAssignmentName(),
            createGradeDto.getGradePercentage(),
            createGradeDto.getWeightPercentage()
        );
        return gradeRepository.save(grade);
    }

    /**
     * Updates an existing grade.
     */
    public GradeEntity updateGrade(String id, CreateGradeDto createGradeDto) {
        Optional<GradeEntity> optionalGrade = gradeRepository.findById(id);
        if(optionalGrade.isPresent()){
            GradeEntity grade = optionalGrade.get();
            grade.setAssignmentName(createGradeDto.getAssignmentName());
            grade.setGradePercentage(createGradeDto.getGradePercentage());
            grade.setWeightPercentage(createGradeDto.getWeightPercentage());
            return gradeRepository.save(grade);
        } else {
            throw new RuntimeException("Grade not found with id: " + id);
        }
    }

    public void deleteGrade(String id) {
        gradeRepository.deleteById(id);
    }
}
