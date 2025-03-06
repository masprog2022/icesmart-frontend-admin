"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getOrderDetails, OrderDetails } from "@/services/orderService";
import { getProductName } from "@/services/productService";
import { formatDate } from "@/utils/utils";
import { useEffect, useState } from "react";

interface OrderDetailsModalProps {
  orderId: number | null;
  onClose: () => void;
  isOpen: boolean;
}

export function OrderDetailsModal({
  orderId,
  onClose,
  isOpen,
}: OrderDetailsModalProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [productNames, setProductNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const data = await getOrderDetails(orderId);
        setOrderDetails(data);

        if (data?.items && data.items.length > 0) {
          const names: Record<number, string> = {};
          for (const item of data.items) {
            if (item.productId) {
              try {
                const name = await getProductName(item.productId);
                names[item.productId] = name;
              } catch (error) {
                names[item.productId] = item.productName;
              }
            }
          }
          setProductNames(names);
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível buscar os detalhes do pedido.",
          variant: "destructive",
        });
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && orderId !== null) {
      fetchOrderDetails();
    }
  }, [orderId, isOpen]);

  if (!isOpen || !orderDetails) return null;
  if (loading) return <div>Carregando...</div>;

  // Cores para status do pedido
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-600 text-white",
    SHIPPED: "bg-blue-600 text-white",
    DELIVERED: "bg-green-600 text-white",
    CANCELLED: "bg-red-600 text-white",
    PAID: "bg-green-600 text-white",
    UNPAID: "bg-red-600 text-white",
    CARD: "bg-blue-600 text-white",
    ONLINE: "bg-green-600 text-white",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl dark:bg-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido #{orderDetails.orderId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Pedido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mt-8">
              Informações do Pedido
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <strong className="font-medium">Cliente:</strong>{" "}
                {orderDetails.clientName}
              </p>
              <p className="text-sm">
                <strong className="font-medium">Contacto:</strong>{" "}
                {orderDetails.clientTelephone}
              </p>
              <p className="text-sm">
                <strong className="font-medium">Endereço:</strong>{" "}
                {orderDetails.address}
              </p>
              <p className="text-sm">
                <strong className="font-medium">Status de entrega:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    statusColors[orderDetails.status] || "bg-gray-600"
                  }`}
                >
                  {orderDetails.status}
                </span>
              </p>
              <p className="text-sm">
                <strong className="font-medium">Data do pedido:</strong>{" "}
                {orderDetails.createdAt
                  ? formatDate(orderDetails.createdAt)
                  : "Data indisponível"}
              </p>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Itens do Pedido</h3>
            <ul className="space-y-3">
              {orderDetails.items?.length > 0 ? (
                orderDetails.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        {productNames[item.productId] ||
                          item.productName ||
                          "Produto Desconhecido"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}x {item.price.toFixed(2)} AOA
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {(item.quantity * item.price).toFixed(2)} AOA
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-300">Nenhum item encontrado.</p>
              )}
            </ul>
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Método de Pagamento</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <strong className="font-medium">Método de Pagamento:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    statusColors[orderDetails.paymentMode] || "bg-gray-600"
                  }`}
                >
                  {orderDetails.paymentMode}
                </span>
              </p>
              <p className="text-sm">
                <strong className="font-medium">Status de pagamento:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    statusColors[orderDetails.payStatus] || "bg-gray-600"
                  }`}
                >
                  {orderDetails.payStatus}
                </span>
              </p>
              <p className="text-sm">
                <strong className="font-medium">Valor Pago:</strong>{" "}
                {orderDetails.totalPrice.toFixed(2)} AOA
              </p>
            </div>
          </div>

          {/* Total do Pedido */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold">Total do Pedido</h3>
            <p className="text-xl font-bold">
              {orderDetails.totalPrice.toFixed(2)} AOA
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
