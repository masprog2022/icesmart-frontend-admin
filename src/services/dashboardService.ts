// src/services/DashboardService.ts
export interface DashboardStats {
  orderCount: number;
  customerCount: number;
  totalSales: number;
  productCount: number;
}

const API_URL = "http://localhost:8081/api/v1/dashboard";

export async function fetchStats(): Promise<DashboardStats> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${API_URL}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch dashboard stats: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.text();
        errorMessage = errorData || errorMessage;
      } catch (e) {
        console.error("Erro ao parsear corpo da resposta:", e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Dashboard stats retrieval error:", error);
    throw error;
  }
}
