package com.app.Tutor;

import com.app.Dto.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TutorService {

    private final TutorRepository tutorRepository;

    public TutorService(TutorRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    public List<TutorEntity> getAllTutors() {
        return tutorRepository.findAll();
    }

    public TutorEntity getTutorById(String id) {
        return tutorRepository.findById(id).orElse(null);
    }

    public TutorEntity addTutor(String userID, TutorDto tutorDto) {
        return tutorRepository.save(toEntity(userID, tutorDto));
    }

    public TutorEntity updateTutor(String userID, TutorDto tutorDto) {
        Optional<TutorEntity> optional_Entity = tutorRepository.findById(userID);

        if (optional_Entity.isPresent()) {
            TutorEntity tutorEntity = optional_Entity.get();
            
            if (tutorDto.getStudent_id_list() != null) {
                tutorEntity.setStudent_id_list(tutorDto.getStudent_id_list());
            }
            
            if (tutorDto.getPost_id_list() != null) {
                tutorEntity.setPost_id_list(tutorDto.getPost_id_list());
            }
            
            if (tutorDto.getReview_id_list() != null) {
                tutorEntity.setReview_id_list(tutorDto.getReview_id_list());
            }
            
            return tutorRepository.save(tutorEntity);
        } else {
            return new TutorEntity();
        }
    }

    public void deleteTutor(String id) {
        tutorRepository.deleteById(id);
    }

    private TutorEntity toEntity(String userID, TutorDto tutorDto) {
        TutorEntity tutorEntity = new TutorEntity(
            userID,
            tutorDto.getStudent_id_list(),
            tutorDto.getPost_id_list(),
            tutorDto.getReview_id_list()
        );

        return tutorEntity;
    }

}
