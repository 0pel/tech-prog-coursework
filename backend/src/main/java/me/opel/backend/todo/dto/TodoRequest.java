package me.opel.backend.todo.dto;

import jakarta.validation.constraints.NotBlank;


public record TodoRequest(@NotBlank(message = "Title is required") String title, String description,
                          boolean completed) {}