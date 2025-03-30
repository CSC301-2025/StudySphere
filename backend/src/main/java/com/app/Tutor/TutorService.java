
package com.app.Tutor;

import com.app.Dto.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TutorService {

    private final TutorRepository tutorRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final TutorPostingRepository tutorPostingRepository;

    public TutorService(TutorRepository tutorRepository, 
                       TutorProfileRepository tutorProfileRepository,
                       TutorPostingRepository tutorPostingRepository) {
        this.tutorRepository = tutorRepository;
        this.tutorProfileRepository = tutorProfileRepository;
        this.tutorPostingRepository = tutorPostingRepository;
    }

    // Original tutor methods
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
    
    // Tutor Profile methods
    
    public TutorProfileDto createTutorProfile(String userId, TutorProfileDto profileDto) {
        // Check if profile already exists
        if (tutorProfileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Profile already exists for this user");
        }
        
        TutorProfileEntity entity = new TutorProfileEntity(
            userId,
            profileDto.getFirstName(),
            profileDto.getLastName(),
            profileDto.getEmail(),
            profileDto.getUniversity(),
            profileDto.getBio(),
            profileDto.getExpertise()
        );
        
        TutorProfileEntity savedEntity = tutorProfileRepository.save(entity);
        return convertToProfileDto(savedEntity);
    }
    
    public TutorProfileDto getTutorProfileByUserId(String userId) {
        Optional<TutorProfileEntity> profileOpt = tutorProfileRepository.findByUserId(userId);
        return profileOpt.map(this::convertToProfileDto).orElse(null);
    }
    
    public TutorProfileDto updateTutorProfile(String userId, TutorProfileDto profileDto) {
        Optional<TutorProfileEntity> profileOpt = tutorProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new NoSuchElementException("Profile not found for user: " + userId);
        }
        
        TutorProfileEntity entity = profileOpt.get();
        
        // Update fields if provided
        if (profileDto.getFirstName() != null) entity.setFirstName(profileDto.getFirstName());
        if (profileDto.getLastName() != null) entity.setLastName(profileDto.getLastName());
        if (profileDto.getEmail() != null) entity.setEmail(profileDto.getEmail());
        if (profileDto.getUniversity() != null) entity.setUniversity(profileDto.getUniversity());
        if (profileDto.getBio() != null) entity.setBio(profileDto.getBio());
        if (profileDto.getExpertise() != null) entity.setExpertise(profileDto.getExpertise());
        
        TutorProfileEntity savedEntity = tutorProfileRepository.save(entity);
        return convertToProfileDto(savedEntity);
    }
    
    // Tutor Posting methods
    
    public TutorPostingDto createTutorPosting(String userId, TutorPostingDto postingDto) {
        // Verify user has a profile first
        if (tutorProfileRepository.findByUserId(userId).isEmpty()) {
            throw new IllegalStateException("User must create a profile before creating a posting");
        }
        
        TutorPostingEntity entity = new TutorPostingEntity(
            userId,
            postingDto.getTitle(),
            postingDto.getCoursesTaught(),
            postingDto.getDescription(),
            postingDto.getLocation(),
            postingDto.getPricePerHour(),
            postingDto.getContactEmail(),
            postingDto.getUniversity()
        );
        
        TutorPostingEntity savedEntity = tutorPostingRepository.save(entity);
        return convertToPostingDto(savedEntity);
    }
    
    public List<TutorPostingDto> getAllTutorPostings() {
        return tutorPostingRepository.findAll().stream()
            .map(this::convertToPostingDto)
            .collect(Collectors.toList());
    }
    
    public TutorPostingDto getTutorPostingById(String id) {
        Optional<TutorPostingEntity> postingOpt = tutorPostingRepository.findById(id);
        return postingOpt.map(this::convertToPostingDto).orElse(null);
    }
    
    public List<TutorPostingDto> getTutorPostingsByUserId(String userId) {
        return tutorPostingRepository.findByTutorId(userId).stream()
            .map(this::convertToPostingDto)
            .collect(Collectors.toList());
    }
    
    public List<TutorPostingDto> filterTutorPostings(TutorFilterDto filterDto) {
        List<TutorPostingEntity> allPostings = tutorPostingRepository.findAll();
        
        return allPostings.stream()
            .filter(posting -> {
                // Filter by university if specified
                if (filterDto.getUniversity() != null && !filterDto.getUniversity().isEmpty()) {
                    if (!filterDto.getUniversity().equals(posting.getUniversity())) {
                        return false;
                    }
                }
                
                // Filter by courses if specified
                if (filterDto.getCourses() != null && !filterDto.getCourses().isEmpty()) {
                    boolean hasMatchingCourse = false;
                    for (String course : filterDto.getCourses()) {
                        for (String taughtCourse : posting.getCoursesTaught()) {
                            if (taughtCourse.toLowerCase().contains(course.toLowerCase())) {
                                hasMatchingCourse = true;
                                break;
                            }
                        }
                        if (hasMatchingCourse) break;
                    }
                    if (!hasMatchingCourse) return false;
                }
                
                // Filter by location if specified
                if (filterDto.getLocation() != null && !filterDto.getLocation().equals("all")) {
                    if (!posting.getLocation().equals(filterDto.getLocation()) && 
                        !posting.getLocation().equals("both")) {
                        return false;
                    }
                }
                
                // Filter by price range
                if (filterDto.getPriceRange() != null) {
                    if (filterDto.getPriceRange().getMin() != null && 
                        posting.getPricePerHour() < filterDto.getPriceRange().getMin()) {
                        return false;
                    }
                    if (filterDto.getPriceRange().getMax() != null && 
                        posting.getPricePerHour() > filterDto.getPriceRange().getMax()) {
                        return false;
                    }
                }
                
                return true;
            })
            .map(this::convertToPostingDto)
            .collect(Collectors.toList());
    }
    
    // Conversion methods
    
    private TutorProfileDto convertToProfileDto(TutorProfileEntity entity) {
        TutorProfileDto dto = new TutorProfileDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setUniversity(entity.getUniversity());
        dto.setBio(entity.getBio());
        dto.setExpertise(entity.getExpertise());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
    
    private TutorPostingDto convertToPostingDto(TutorPostingEntity entity) {
        TutorPostingDto dto = new TutorPostingDto();
        dto.setId(entity.getId());
        dto.setTutorId(entity.getTutorId());
        dto.setTitle(entity.getTitle());
        dto.setCoursesTaught(entity.getCoursesTaught());
        dto.setDescription(entity.getDescription());
        dto.setLocation(entity.getLocation());
        dto.setPricePerHour(entity.getPricePerHour());
        dto.setContactEmail(entity.getContactEmail());
        dto.setUniversity(entity.getUniversity());
        return dto;
    }
}
