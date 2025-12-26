package me.opel.backend.todo;

import me.opel.backend.todo.dto.TodoRequest;
import me.opel.backend.todo.dto.TodoResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TodoMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Todo toTodo(TodoRequest todoRequest);

    TodoResponse toResponse(Todo todo);
}
