export interface Order {
  orderId: number;
  clientName: string;
  clientTelephone: string;
  totalPrice: number;
  address: string;
  status: string;
  payStatus: string;
  createdAt: string;
}

export interface OrderDetails {
  orderId: number;
  clientId: number;
  clientName: string;
  clientTelephone: string;
  totalPrice: number;
  address: string;
  status: string;
  payStatus: string;
  paymentMode: string;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

const API_URL = "http://localhost:8081/api/v1/orders";
const API_URL_DETAILS = "http://localhost:8081/api/v1/orders/admin/orders";

export async function getOrders(): Promise<Order[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(API_URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        errorData || `Error fetching orders from API: ${response.statusText}`
      );
    }

    const data = await response.json();

    return data
      .map(
        ({
          orderId,
          clientName,
          clientTelephone,
          totalPrice,
          address,
          status,
          payStatus,
          createdAt,
        }: any) => ({
          orderId,
          clientName: clientName || "Cliente Desconhecido",
          clientTelephone,
          totalPrice,
          address,
          status,
          payStatus,
          createdAt,
        })
      )
      .sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch (error) {
    console.error("Order retrieval error:", error);
    throw error;
  }
}

export async function getOrderDetails(orderId: number): Promise<OrderDetails> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${API_URL_DETAILS}/details/${orderId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error fetching order details from API"
      );
    }

    const data = await response.json();
    return data; // Retorna os detalhes do pedido
  } catch (error: any) {
    throw new Error(error.message || "Erro ao buscar detalhes do pedido");
  }
}
