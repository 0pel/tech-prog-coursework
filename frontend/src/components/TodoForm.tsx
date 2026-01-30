import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Textarea} from "@/components/ui/textarea.tsx"
import React, {useState} from "react"

interface TodoFormProps {
    onSubmit: (title: string, description: string) => void
    onCancel?: () => void
    initialTitle?: string
    initialDescription?: string
    submitLabel?: string
}

export function TodoForm({
                             onSubmit,
                             onCancel,
                             initialTitle = "",
                             initialDescription = "",
                             submitLabel = "Add Todo",
                         }: Readonly<TodoFormProps>) {
    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState(initialDescription)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onSubmit(title, description)
            setTitle("")
            setDescription("")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{submitLabel}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Todo title..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Textarea
                            placeholder="Description (optional)..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit">{submitLabel}</Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
