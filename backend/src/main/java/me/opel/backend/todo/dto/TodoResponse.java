package me.opel.backend.todo.dto;

import java.time.LocalDateTime;


public record TodoResponse(Long id,
                           String title,
                           String description,
                           Boolean completed,
                           LocalDateTime createdAt,
                           LocalDateTime updatedAt) {}