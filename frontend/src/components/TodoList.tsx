import { TodoItem } from "@/components/TodoItem.tsx"
import type { Todo } from "@/services/api"

interface TodoListProps {
    todos: Todo[]
    onToggle: (id: number) => void
    onDelete: (id: number) => void
    onUpdate: (id: number, title: string, description: string) => void
}

export function TodoList({ todos, onToggle, onDelete, onUpdate }: Readonly<TodoListProps>) {
    if (todos.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                No todos yet. Create one to get started!
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    )
}
