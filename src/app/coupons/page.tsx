"use client";

import React from "react";
import { SectionTitle, Card, SubTitle } from "@/components/ui/PRDComponents";

type CouponRow = {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiry: string;
  active: boolean;
};

const coupons: CouponRow[] = [
  { code: 'ABUNDANCE10', type: 'percentage', value: 10, expiry: '2026-12-31', active: true },
  { code: 'WELCOME15', type: 'percentage', value: 15, expiry: '2026-12-31', active: true },
  { code: 'BLACKFRIDAY', type: 'percentage', value: 20, expiry: '2026-11-30', active: false },
];

export default function CouponsPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>Coupons</SectionTitle>
      <p className="mb-6 text-lg">Browse available coupon codes for Phase 1. This page is a lightweight placeholder to mirror the PRD plan.</p>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c.code} className="p-4 border border-border-subtle rounded">
              <div className="flex items-center justify-between mb-2">
                <strong style={{ fontFamily: 'monospace' }}>{c.code}</strong>
                <span className="text-xs" style={{ color: '#C8A84B' }}>{c.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="text-sm">Type: {c.type}</div>
              <div className="text-sm">Value: {c.value}{c.type === 'percentage' ? '%' : ''}</div>
              <div className="text-xs text-muted">Expiry: {new Date(c.expiry).toDateString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
