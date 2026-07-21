import type { User, CreateUser } from "../types/user";

const API_URL = "http://localhost:5047/api/Users";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const createUser = async (
  user: CreateUser
): Promise<User> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);

    throw new Error("Failed to create user");
  }

  return response.json();
};