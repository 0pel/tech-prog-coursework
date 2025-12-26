package me.opel.backend.todo;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.opel.backend.todo.dto.TodoRequest;
import me.opel.backend.todo.dto.TodoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoController {
    private final TodoService service;

    @GetMapping("/{id}")
    public TodoResponse getTodo(@PathVariable long id) {
        return service.getTodoById(id);
    }

    @GetMapping
    public List<TodoResponse> getAll() {
        return service.getAllTodos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TodoResponse createTodo(@Valid @RequestBody TodoRequest todoRequest) {
        return service.createTodo(todoRequest);
    }

    @PutMapping("/{id}")
    public TodoResponse updateTodo(@PathVariable long id, @Valid @RequestBody TodoRequest todoRequest) {
        return service.updateTodo(id, todoRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTodo(@PathVariable long id) {
        service.deleteTodo(id);
    }

    @PatchMapping("/{id}/toggle")
    public TodoResponse toggleTodoCompleted(@PathVariable long id) {
        return service.toggleTodoComplete(id);
    }

}

