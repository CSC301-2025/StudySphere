package com.app.Notes;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@NoArgsConstructor
public class NotesEntity {

    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    // The raw PDF file content
    private byte[] pdfData;
    
    // Metadata for the PDF file
    private String pdfFileName;
    private String pdfContentType;
}
