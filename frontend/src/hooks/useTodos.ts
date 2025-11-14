import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { z } from "zod";

const TodoSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});


const TodosSchema = z.array(TodoSchema);

// GET TODOS 
export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/todos");
    console.log("API TODOS:", res.data); 

      return TodosSchema.parse(res.data);

       

      
    },
  });
}

//  CREATE TODO 
export function useCreateTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/todos", payload);
      return TodoSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// UPDATE TODO 
export function useUpdateTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/todos/${id}`, data);
      return TodoSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// DELETE TODO 
export function useDeleteTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/todos/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useTodoss() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/todos").catch(err => {
        console.log("API ERROR:", err);
        throw err;
      });
      console.log("SERVER RESPONSE:", res.data);
      return TodosSchema.parse(res.data);
    },
  });
}
