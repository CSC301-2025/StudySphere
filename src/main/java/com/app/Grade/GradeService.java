package com.app.Grade;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
     * Saves a new grade to the database.
     */
    public GradeEntity saveGrade(GradeEntity grade) {
        return gradeRepository.save(grade);
    }

    /**
     * Updates an existing grade.
     */
    public GradeEntity updateGrade(String id, GradeEntity grade) {
        Optional<GradeEntity> optionalGrade = gradeRepository.findById(id);
        if(optionalGrade.isPresent()){
            GradeEntity updated_grade = optionalGrade.get();
            updated_grade.setAssignmentName(grade.getAssignmentName());
            updated_grade.setGradePercentage(grade.getGradePercentage());
            updated_grade.setWeightPercentage(grade.getWeightPercentage());
            return gradeRepository.save(updated_grade);
        } else {
            throw new RuntimeException("Grade not found with id: " + id);
        }
    }

    public void deleteGrade(String id) {
        gradeRepository.deleteById(id);
    }
}
