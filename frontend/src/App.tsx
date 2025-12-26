import { TodoForm } from "@/components/TodoForm"
import { TodoList } from "@/components/TodoList"
import { apiService, type Todo } from "@/services/api"
import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

function App() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTodos().then()
    }, [])

    const loadTodos = async () => {
        try {
            setLoading(true)
            const data = await apiService.getAllTodos()
            setTodos(data)
            setError(null)
        } catch (err) {
            setError("Failed to load todos.  Please check if the backend is running.")
            console.error("Error loading todos:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTodo = async (title: string, description: string) => {
        try {
            const newTodo = await apiService.createTodo({
                title,
                description,
                completed: false,
            })
            setTodos([newTodo, ...todos])
        } catch (err) {
            console.error("Error creating todo:", err)
            alert("Failed to create todo")
        }
    }

    const handleToggleTodo = async (id: number) => {
        try {
            const updatedTodo = await apiService.toggleTodoComplete(id)
            setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)))
        } catch (err) {
            console.error("Error toggling todo:", err)
            alert("Failed to update todo")
        }
    }

    const handleDeleteTodo = async (id: number) => {
        try {
            await apiService.deleteTodo(id)
            setTodos(todos.filter(todo => todo.id !== id))
        } catch (err) {
            console.error("Error deleting todo:", err)
            alert("Failed to delete todo")
        }
    }

    const handleUpdateTodo = async (id: number, title: string, description: string) => {
        try {
            const todo = todos.find(t => t.id === id)
            if (!todo) return

            const updatedTodo = await apiService.updateTodo(id, {
                title,
                description,
                completed: todo.completed,
            })
            setTodos(todos.map(t => (t.id === id ? updatedTodo : t)))
        } catch (err) {
            console.error("Error updating todo:", err)
            alert("Failed to update todo")
        }
    }

    const activeTodos = todos.filter(todo => !todo.completed)
    const completedTodos = todos.filter(todo => todo.completed)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-10 w-10 text-indigo-600" />
                        <h1 className="text-4xl font-bold text-gray-900">Todo App</h1>
                    </div>
                    <p className="text-gray-600">Stay organized and productive</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border-destructive text-destructive mb-6 rounded-lg border px-4 py-3">
                        {error}
                    </div>
                )}

                <div className="mb-8">
                    <TodoForm onSubmit={handleCreateTodo} submitLabel="Add Todo" />
                </div>

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">Loading todos...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                Active Todos ({activeTodos.length})
                            </h2>
                            <TodoList
                                todos={activeTodos}
                                onToggle={handleToggleTodo}
                                onDelete={handleDeleteTodo}
                                onUpdate={handleUpdateTodo}
                            />
                        </div>

                        {completedTodos.length > 0 && (
                            <div>
                                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                    Completed ({completedTodos.length})
                                </h2>
                                <TodoList
                                    todos={completedTodos}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                    onUpdate={handleUpdateTodo}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
