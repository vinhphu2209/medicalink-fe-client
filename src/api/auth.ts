// src/api/auth.ts
import { apiClient } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export const fetchUser = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const exampleAPI = async () => {
  const response = await apiClient.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
};
