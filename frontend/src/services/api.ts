import axiosInstance from "@/config/axios.ts"
import type { AxiosResponse } from "axios"

export interface Todo {
    id: number
    title: string
    description: string
    completed: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateTodoRequest {
    title: string
    description?: string
    completed: boolean
}

export interface UpdateTodoRequest {
    title: string
    description?: string
    completed?: boolean
}

class ApiService {
    async getAllTodos(): Promise<Todo[]> {
        const response: AxiosResponse<Todo[]> = await axiosInstance.get("/todos")
        return response.data
    }

    async getTodoById(id: number): Promise<Todo> {
        const response: AxiosResponse<Todo> = await axiosInstance.get(`/todos/${id}`)
        return response.data
    }

    async createTodo(data: CreateTodoRequest): Promise<Todo> {
        const response: AxiosResponse<Todo> = await axiosInstance.post("/todos", data)
        return response.data
    }

    async updateTodo(id: number, data: UpdateTodoRequest): Promise<Todo> {
        const response: AxiosResponse<Todo> = await axiosInstance.put(`/todos/${id}`, data)
        return response.data
    }

    async toggleTodoComplete(id: number): Promise<Todo> {
        const response: AxiosResponse<Todo> = await axiosInstance.patch(`/todos/${id}/toggle`)
        return response.data
    }

    async deleteTodo(id: number): Promise<void> {
        await axiosInstance.delete(`/todos/${id}`)
    }
}

export const apiService = new ApiService()
