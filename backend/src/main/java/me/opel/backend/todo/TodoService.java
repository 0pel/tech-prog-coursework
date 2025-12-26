package me.opel.backend.todo;

import lombok.RequiredArgsConstructor;
import me.opel.backend.todo.dto.TodoRequest;
import me.opel.backend.todo.dto.TodoResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TodoService {
    private final TodoMapper mapper;
    private final TodoRepository repository;

    @Transactional
    public TodoResponse createTodo(TodoRequest todoRequest) {
        var todo = mapper.toTodo(todoRequest);
        repository.save(todo);
        return mapper.toResponse(todo);
    }

    @Transactional
    public TodoResponse getTodoById(long id) {
        var todo = repository.getReferenceById(id);
        return mapper.toResponse(todo);
    }

    @Transactional
    public TodoResponse updateTodo(long id, TodoRequest todoRequest) {
        var todo = repository.getReferenceById(id);
        todo.setTitle(todoRequest.title());
        todo.setDescription(todoRequest.description());
        todo.setCompleted(todoRequest.completed());

        return mapper.toResponse(todo);
    }

    @Transactional
    public void deleteTodo(long id) {
        repository.deleteById(id);
    }

    @Transactional
    public TodoResponse toggleTodoComplete(long id) {
        var todo = repository.getReferenceById(id);
        todo.setCompleted(!todo.isCompleted());
        return mapper.toResponse(todo);
    }

    public List<TodoResponse> getAllTodos() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(mapper::toResponse).toList();
    }

}
