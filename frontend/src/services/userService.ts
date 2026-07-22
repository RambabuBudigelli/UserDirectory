import type { User, CreateUserRequest } from "../types/User";

const API_URL = "http://localhost:5047/api/Users";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Get users API error:", errorText);

    throw new Error("Failed to load users.");
  }

  return response.json();
}

export async function createUser(
  user: CreateUserRequest,
  accessToken: string
): Promise<User> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Create user API error:");
    console.error("Status:", response.status);
    console.error("Response:", errorText);

    throw new Error(
      `Failed to create user. Status: ${response.status}`
    );
  }

  return response.json();
}