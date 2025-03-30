package com.app.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotesDto {

    private String id;
    private String title;
    private String description;
    private String pdfFileName;
    private String pdfContentType;
    // Note: pdfData is omitted for response to avoid large payloads.
}
