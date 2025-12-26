package me.opel.backend.todo;

import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<@NonNull Todo, @NonNull Long> {
    List<Todo> findAllByOrderByCreatedAtDesc();

    List<Todo> findAllByCompletedOrderByCreatedAtDesc(boolean completed);

}