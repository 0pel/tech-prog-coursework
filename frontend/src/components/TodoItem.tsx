import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Todo } from "@/services/api"
import { Check, Edit2, Trash2, X } from "lucide-react"
import { useState } from "react"

interface TodoItemProps {
    todo: Todo
    onToggle: (id: number) => void
    onDelete: (id: number) => void
    onUpdate: (id: number, title: string, description: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: Readonly<TodoItemProps>) {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(todo.title)
    const [editDescription, setEditDescription] = useState(todo.description || "")

    const handleUpdate = () => {
        if (editTitle.trim()) {
            onUpdate(todo.id, editTitle, editDescription)
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        setEditTitle(todo.title)
        setEditDescription(todo.description || "")
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <Input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            placeholder="Todo title"
                        />
                        <Textarea
                            value={editDescription}
                            onChange={e => setEditDescription(e.target.value)}
                            placeholder="Description"
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdate}>
                                <Check className="mr-1 h-4 w-4" />
                                Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="mr-1 h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                    <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => onToggle(todo.id)}
                        className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                        <h3
                            className={`font-medium ${
                                todo.completed ? "text-muted-foreground line-through" : ""
                            }`}
                        >
                            {todo.title}
                        </h3>
                        {todo.description && (
                            <p
                                className={`mt-1 text-sm ${
                                    todo.completed
                                        ? "text-muted-foreground line-through"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {todo.description}
                            </p>
                        )}
                        <p className="text-muted-foreground mt-2 text-xs">
                            {new Date(todo.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDelete(todo.id)}>
                            <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
