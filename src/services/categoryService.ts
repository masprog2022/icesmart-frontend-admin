export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  hasOrders: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface ICategory {
  id: number;
  name: string;
}

const API_URL = "http://localhost:8081/api/v1/categories";

export async function getData(): Promise<Category[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${API_URL}/all`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching API data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    //console.error("Data retrieval error:", error);
    return [];
  }
}

export const createCategory = async (data: {
  name: string;
  description: string;
}): Promise<Category> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw {
      message: responseData.message || "Erro ao criar a categoria",
      status: response.status,
    };
  }

  return responseData;
};

export async function deleteCategory(categoryId: number): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        responseData?.message ||
          `Notificação ${response.status}: Falha ao excluir a categoria`
      );
    }
  } catch (error: any) {
    console.error("🚨 Erro ao excluir categoria:", error.message);
    throw new Error(error.message || "Erro desconhecido ao excluir categoria");
  }
}

export async function updateCategory(
  categoryId: number,
  data: { name: string; description: string }
): Promise<Category> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar a categoria");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Erro ao atualizar categoria:", error.message);
    throw new Error(
      error.message || "Erro desconhecido ao atualizar categoria"
    );
  }
}
