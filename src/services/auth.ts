// services/auth.ts
const API_URL = "http://localhost:8081/api/v1/auth";

export interface LoginResponse {
  token: string;
  name: string;
  username: string;
  role: string;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse | null> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}
