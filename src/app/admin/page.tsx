"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  SectionTitle,
  SubTitle,
  Badge,
  Bullet,
} from "@/components/ui/PRDComponents";
import { getProducts, getOrders, getCoupons } from "@/lib/db";
import { Product, Order, Coupon } from "@/types";

const AdminDashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setProducts(await getProducts());
    setOrders(await getOrders());
    setCoupons(await getCoupons());
  };

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const lowStockProducts = products.filter((p) =>
    p.variants.some((v) => v.stock <= 5 && v.stock > 0),
  ).length;
  const outOfStockProducts = products.filter((p) =>
    p.variants.every((v) => v.stock === 0),
  ).length;
  const totalNewsletterSignups = 0;

  // Simple bestselling item logic (could be more complex with actual order data)
  const bestsellingItem = products.reduce(
    (acc, product) => {
      const totalSold = orders.reduce((sum, order) => {
        return (
          sum +
          order.items
            .filter((item) => item.productId === product.id)
            .reduce((itemSum, item) => itemSum + item.quantity, 0)
        );
      }, 0);
      if (totalSold > acc.count) {
        return { name: product.name, count: totalSold };
      }
      return acc;
    },
    { name: "N/A", count: 0 },
  );

  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>Admin Dashboard</SectionTitle>
      <p className="mb-8 text-lg leading-relaxed">
        Welcome to the Abundance Clothing Admin Panel.
      </p>

      <SubTitle>Overview</SubTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card accent>
          <p className="text-text-secondary">Total Products</p>
          <p className="text-gold-primary text-3xl font-bebas-neue">
            {totalProducts}
          </p>
        </Card>
        <Card accent>
          <p className="text-text-secondary">Total Orders (WhatsApp)</p>
          <p className="text-gold-primary text-3xl font-bebas-neue">
            {totalOrders}
          </p>
        </Card>
        <Card accent>
          <p className="text-text-secondary">Low Stock Items</p>
          <p className="text-gold-primary text-3xl font-bebas-neue">
            {lowStockProducts}
          </p>
        </Card>
        <Card accent>
          <p className="text-text-secondary">Out of Stock Items</p>
          <p className="text-gold-primary text-3xl font-bebas-neue">
            {outOfStockProducts}
          </p>
        </Card>
        <Card accent>
          <p className="text-text-secondary">Bestselling Item</p>
          <p className="text-gold-primary text-3xl font-bebas-neue">
            {bestsellingItem.name} ({bestsellingItem.count})
          </p>
        </Card>
        <Card accent>
          <p className="text-text-secondary">Newsletter Signups</p>
          <p className="text-gold-primary text-3xl font-bebas-neue">
            {totalNewsletterSignups}
          </p>
        </Card>
      </div>

      <SubTitle>Quick Actions</SubTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="primary" className="w-full">
            Manage Products
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="secondary" className="w-full">
            View Orders
          </Button>
        </Link>
      </div>

      <SubTitle>Recent Orders</SubTitle>
      {orders.length === 0 ? (
        <p className="text-text-secondary">No orders yet.</p>
      ) : (
        <Card>
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center py-3 border-b border-border-subtle last:border-b-0"
            >
              <div>
                <p className="text-text-primary">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-text-secondary text-sm">
                  {order.customerName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gold-primary font-mono">₦{order.total}</p>
                <Badge type="blue">{order.status}</Badge>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default AdminDashboardPage;
