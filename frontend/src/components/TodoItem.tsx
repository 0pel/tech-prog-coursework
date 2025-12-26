import {useState} from 'react';
import {Check, Edit2, Trash2, X} from 'lucide-react';
import type {Todo} from '@/services/api';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Card, CardContent} from './ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, title: string, description: string) => void;
}

export function TodoItem({todo, onToggle, onDelete, onUpdate}: Readonly<TodoItemProps>) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDescription, setEditDescription] = useState(todo.description || '');

    const handleUpdate = () => {
        if (editTitle.trim()) {
            onUpdate(todo.id, editTitle, editDescription);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setEditDescription(todo.description || '');
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Todo title"
                        />
                        <Textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdate}>
                                <Check className="h-4 w-4 mr-1"/>
                                Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="h-4 w-4 mr-1"/>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
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
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`font-medium ${
                                todo.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                        >
                            {todo.title}
                        </h3>
                        {todo.description && (
                            <p
                                className={`text-sm mt-1 ${
                                    todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                                }`}
                            >
                                {todo.description}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            {new Date(todo.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit2 className="h-4 w-4"/>
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(todo.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}