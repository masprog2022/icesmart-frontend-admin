export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  specialPrice: number;
  categoryName: string;
  categoryId: number;
  isActive: boolean;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string | null;
}

const API_URL = "http://localhost:8081/api/v1/products";

export async function getData(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error("Error fetching API data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Data retrieval error:", error);
    return [];
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao excluir o produto");
    }
  } catch (error: any) {
    console.error("Erro ao excluir produto:", error.message);
    throw new Error(error.message || "Erro desconhecido ao excluir produto");
  }
}

export const createProduct = async (
  categoryId: number,
  productData: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
  }
): Promise<Product> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`${API_URL}/${categoryId}/add`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao criar o produto");
  }

  return await response.json();
};

export async function getProducts(): Promise<Product[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  const response = await fetch(`${API_URL}/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }

  return await response.json();
}

export async function getDataId(categoryId?: number) {
  let url = `${API_URL}`;

  if (categoryId !== undefined) {
    url += `?categoryId=${categoryId}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return await response.json();
}

export const updateProduct = async (
  productId: number,
  productData: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
    categoryId: number;
  }
): Promise<Product> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar o produto");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error.message);
    throw new Error(
      error.message || "Erro desconhecido ao atualizar o produto"
    );
  }
};
/*export async function getProductName(productId: number): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/productName/${productId}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar nome do produto");
    }
    const data = await response.json();
    return data.productName;
  } catch (error) {
    console.error("Erro ao buscar nome do produto:", error);
    return "Produto desconhecido";
  }
}*/

export async function getProductName(productId: number): Promise<string> {
  try {
    if (!productId || isNaN(productId)) {
      throw new Error("Invalid product ID");
    }

    const response = await fetch(`${API_URL}/productName/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao buscar nome do produto");
    }

    const data = await response.json();
    return data.name; // backend retorna { "name": "Gelo Seco" } por exemplo
  } catch (error: any) {
    console.error("Erro ao buscar nome do produto:", error.message);
    throw new Error(
      error.message || "Erro desconhecido ao buscar nome do produto"
    );
  }
}
