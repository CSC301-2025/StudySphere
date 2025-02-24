package com.app.Role;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.*;
import lombok.Data;

@Document(collection = "roles")
@Data

public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
