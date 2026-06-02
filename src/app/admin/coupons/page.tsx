"use client";

import { SectionTitle, SubTitle, Card } from "@/components/ui/PRDComponents";
import { getCoupons, saveCoupon, deleteCoupon } from "@/lib/db";
import { Coupon } from "@/types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    type: "percentage",
    value: 10,
    expiry: new Date().toISOString().slice(0, 10),
    active: true,
    usageCount: 0,
  });

  useEffect(() => {
    (async () => {
      const data = await getCoupons();
      setCoupons(data);
    })();
  }, []);

  const refreshCoupons = async () => {
    const data = await getCoupons();
    setCoupons(data);
  };

  const addCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    // Normalize code
    const code = (newCoupon.code || "").toString().toUpperCase();
    // Check duplicates
    const exists = coupons.find((c) => c.code.toUpperCase() === code);
    if (exists) {
      alert("Coupon code already exists");
      return;
    }
    const coupon: Coupon = {
      code,
      type: newCoupon.type as Coupon["type"],
      value: Number(newCoupon.value) || 0,
      expiry: newCoupon.expiry || new Date().toISOString(),
      usageCount: 0,
      active: newCoupon.active ?? true,
    };
    await saveCoupon(coupon);
    await refreshCoupons();
    setNewCoupon({
      code: "",
      type: "percentage",
      value: 10,
      expiry: new Date().toISOString().slice(0, 10),
      active: true,
      usageCount: 0,
    });
  };

  const toggleCoupon = async (code: string) => {
    const c = coupons.find((x) => x.code === code);
    if (!c) return;
    const updated = { ...c, active: !c.active };
    await saveCoupon(updated);
    await refreshCoupons();
  };

  const removeCoupon = async (code: string) => {
    await deleteCoupon(code);
    await refreshCoupons();
  };

  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>Coupon Management</SectionTitle>
      <p className="mb-6 text-lg">
        Manage active promo codes for Phase 1. This is mock data stored locally
        for now.
      </p>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SubTitle>Active Coupons</SubTitle>
          <span className="text-xs uppercase" style={{ color: "#C8A84B" }}>
            Mock Data
          </span>
        </div>
        {coupons.length === 0 ? (
          <p className="text-text-secondary">No coupons defined yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {coupons.map((c, index) => (
              <motion.div
                key={c.code}
                className="p-4 border border-border-subtle rounded"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <strong style={{ fontFamily: "monospace" }}>{c.code}</strong>
                  <span className="text-xs" style={{ color: "#C8A84B" }}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-sm">Type: {c.type}</div>
                <div className="text-sm">
                  Value: {c.value}
                  {c.type === "percentage" ? "%" : ""}
                </div>
                <div className="text-xs text-muted">
                  Expiry: {new Date(c.expiry).toDateString()}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => toggleCoupon(c.code)}
                    className="px-2 py-1 bg-background-raised border border-border-subtle text-gold-primary"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => removeCoupon(c.code)}
                    className="px-2 py-1 bg-background-raised border border-border-subtle text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-6">
        <form
          onSubmit={addCoupon}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-1">
              Code
            </label>
            <input
              className="w-full p-2 bg-background-raised border border-border-subtle"
              value={newCoupon.code || ""}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-1">
              Type
            </label>
            <select
              className="w-full p-2 bg-background-raised border border-border-subtle"
              value={newCoupon.type as string}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  type: e.target.value as Coupon["type"],
                })
              }
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-1">
              Value
            </label>
            <input
              type="number"
              className="w-full p-2 bg-background-raised border border-border-subtle"
              value={newCoupon.value as number}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, value: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-1">
              Expiry
            </label>
            <input
              type="date"
              className="w-full p-2 bg-background-raised border border-border-subtle"
              value={newCoupon.expiry?.toString().slice(0, 10)}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, expiry: e.target.value })
              }
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={!!newCoupon.active}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, active: e.target.checked })
                }
              />{" "}
              Active
            </label>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-gold-primary text-black py-2 px-4 border border-gold-primary rounded"
            >
              Add Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
