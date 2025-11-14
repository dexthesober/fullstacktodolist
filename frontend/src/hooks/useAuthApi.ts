import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import { AuthResponseSchema } from "../schemas/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/auth/register", payload);
      return AuthResponseSchema.parse(res.data);
    }
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/auth/login", payload);
      return AuthResponseSchema.parse(res.data);
    }
  });
}

export function useForgot() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/auth/forgot", payload);
      return res.data;
    }
  });
}

export function useReset() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/auth/reset", payload);
      return res.data;
    }
  });
}
