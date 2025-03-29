package com.app.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateNoteDto {

    @NotBlank(message = "Title is required.")
    private String title;
    
    private String description;
    
    // The PDF file content, typically sent as a Base64 encoded string that is converted to byte[]
    @NotNull(message = "PDF data must be provided.")
    private byte[] pdfData;
    
    @NotBlank(message = "PDF file name is required.")
    private String pdfFileName;
    
    @NotBlank(message = "PDF content type is required.")
    private String pdfContentType;
}
