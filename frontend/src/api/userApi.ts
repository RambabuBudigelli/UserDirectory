import type { User, CreateUserRequest } from "../types/User";

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:5047/api/Users";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Get users API error:", errorText);

    throw new Error("Failed to load users.");
  }

  const payload = await response.json();

  // Handle different possible shapes returned by backend (array or envelope)
  if (Array.isArray(payload)) return payload as User[];
  if (payload && Array.isArray(payload.value)) return payload.value as User[];
  if (payload && Array.isArray(payload.items)) return payload.items as User[];

  console.error("Unexpected users response shape:", payload);
  throw new Error("Failed to load users (unexpected response).");
}

export async function createUser(
  user: CreateUserRequest,
  accessToken?: string
): Promise<User> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = "Bearer " + accessToken;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers,
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
