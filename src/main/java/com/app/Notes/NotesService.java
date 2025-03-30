package com.app.Notes;

import com.app.Dto.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotesService {

    private final NotesRepository notesRepository;

    public NotesService(NotesRepository notesRepository) {
        this.notesRepository = notesRepository;
    }

    public List<NotesEntity> getAllNotes() {
        return notesRepository.findAll();
    }

    public NotesEntity getNoteById(String id) {
        return notesRepository.findById(id).orElse(null);
    }

    public NotesEntity saveNote(CreateNoteDto createNoteDto) {
        if (notesRepository.existsByTitle(createNoteDto.getTitle())) {
            throw new IllegalArgumentException("A note with this title already exists.");
        }
        
        NotesEntity note = new NotesEntity();
        note.setTitle(createNoteDto.getTitle());
        note.setDescription(createNoteDto.getDescription());
        note.setPdfData(createNoteDto.getPdfData()); // Expecting a byte[] or a base64-decoded value
        note.setPdfFileName(createNoteDto.getPdfFileName());
        note.setPdfContentType(createNoteDto.getPdfContentType());
        
        return notesRepository.save(note);
    }

    public NotesDto convertToDto(NotesEntity note) {
        NotesDto dto = new NotesDto();
        dto.setId(note.getId());
        dto.setTitle(note.getTitle());
        dto.setDescription(note.getDescription());
        dto.setPdfFileName(note.getPdfFileName());
        dto.setPdfContentType(note.getPdfContentType());
        // Note: pdfData is omitted in the DTO for security/size reasons.
        return dto;
    }

    public void deleteNote(String id) {
        notesRepository.deleteById(id);
    }
}
