"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionTitle, SubTitle, Badge } from "@/components/ui/PRDComponents";
import { getOrders, updateOrderStatus } from "@/lib/db";
import { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Eye, Edit, Save, X } from "lucide-react";
import Image from "next/image";

const OrderStatusColors: Record<OrderStatus, "default" | "gold" | "green" | "red" | "blue"> = {
  Received: "blue",
  Processing: "gold",
  Packed: "gold",
  Shipped: "blue",
  Delivered: "green",
};

const AdminOrdersPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("abundance_admin_auth");
    if (auth !== "true") {
      router.push("/admin-login");
    } else {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, [router]);

  const fetchOrders = async () => {
    setOrders(await getOrders());
  };

  const handleEditStatus = (order: Order) => {
    setEditingOrderId(order.id);
    setSelectedOrder(order);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        status: e.target.value as OrderStatus,
      });
    }
  };

  const handleSaveStatus = async () => {
    if (selectedOrder) {
      await updateOrderStatus(selectedOrder!.id, selectedOrder!.status);
      setEditingOrderId(null);
      fetchOrders();
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>Order Log</SectionTitle>
      <p className="mb-8 text-lg leading-relaxed">
        Manage incoming WhatsApp orders and update their status.
      </p>

      {orders.length === 0 ? (
        <Card>
          <p className="text-center py-8">No orders have been placed yet.</p>
        </Card>
      ) : (
        <Card>
          <table className="min-w-full divide-y divide-border-subtle">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-text-primary font-mono text-sm">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gold-primary font-mono">
                    ₦{formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingOrderId === order.id && selectedOrder ? (
                      <select
                        value={selectedOrder.status}
                        onChange={handleStatusChange}
                        className="p-1 bg-background-raised border border-border-subtle text-text-primary focus:outline-none focus:border-gold-primary"
                      >
                        {Object.keys(OrderStatusColors).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Badge type={OrderStatusColors[order.status]}>
                        {order.status}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                    {editingOrderId === order.id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveStatus}
                        className="text-green-500 hover:text-white mr-2"
                      >
                        <Save size={16} />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStatus(order)}
                        className="text-gold-primary hover:text-white mr-2"
                      >
                        <Edit size={16} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-500 hover:text-white"
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </Button>
            <h2 className="text-2xl font-bebas-neue text-gold-primary mb-6 border-b border-border-subtle pb-2">
              Order Details #{selectedOrder.id.slice(0, 8)}
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                <strong>Customer Name:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.deliveryAddress},{" "}
                {selectedOrder.city}, {selectedOrder.state}
              </p>
              <p>
                <strong>Order Notes:</strong>{" "}
                {selectedOrder.orderNotes || "N/A"}
              </p>
              <p>
                <strong>Total:</strong> ₦{formatPrice(selectedOrder.total)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge type={OrderStatusColors[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>

              <SubTitle>Items</SubTitle>
              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-2 border-b border-border-subtle last:border-b-0"
                >
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p className="text-text-primary">{item.name}</p>
                    <p className="text-sm">
                      Size: {item.size}, Color: {item.color}
                    </p>
                    <p className="text-sm text-gold-primary">
                      Qty: {item.quantity} x ₦{formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
