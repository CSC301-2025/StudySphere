package com.app.Notes;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/notes")
public class NoteController {

    private final NoteService notesService;

    public NoteController(NoteService notesService) {
        this.notesService = notesService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotesDto>>> getAllNotes() {
        List<NotesDto> dtos = notesService.getAllNotes().stream()
            .map(notesService::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Notes retrieved", dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotesDto>> getNote(@PathVariable String id) {
        NoteEntity note = notesService.getNoteById(id);
        if (note != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Note found", notesService.convertToDto(note)));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Note not found", null));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<String>> submitNote(@Valid @RequestBody CreateNoteDto createNoteDto) {
        try {
            notesService.saveNote(createNoteDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Note submitted", null));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred during note submission.", null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNote(@PathVariable String id) {
        notesService.deleteNote(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Note deleted", null));
    }
}
