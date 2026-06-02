"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getWhatsAppURL } from "@/lib/whatsapp";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  deliveryAddress: z.string().min(1, "Delivery Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  orderNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const {
    items,
    getItemCount,
    getTotalPrice,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    couponCode,
  } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gold-primary">
        <h1 className="text-4xl font-bebas-neue mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-text-secondary mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/shop">
          <Button variant="primary">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    setCouponError("");
    try {
      const result = await applyCoupon(couponCode);
      if (!result.success) {
        setCouponError(result.message || "Invalid coupon code.");
      }
    } catch (error: any) {
      setCouponError(error.message || "An error occurred applying the coupon.");
    }
  };

  const onSubmit = (data: CheckoutFormData) => {
    // Build WhatsApp message
    let message = `🛍️ NEW ORDER — Abundance Clothing\n\n`;
    message += `👤 Customer: ${data.fullName}\n`;
    message += `📞 Phone: ${data.phoneNumber}\n`;
    message += `📍 Address: ${data.deliveryAddress}, ${data.city}, ${data.state}\n`;
    if (data.email) {
      message += `📧 Email: ${data.email}\n\n`;
    } else {
      message += `\n`;
    }

    message += `🧾 ORDER DETAILS:\n`;
    cart.items.forEach((item) => {
      message += `• ${item.name}\n`;
      message += `  Size: ${item.size} | Color: ${item.color}\n`;
      message += `  Qty: ${item.quantity} × ₦${item.price} = ₦${item.quantity * item.price}\n\n`;
    });

    message += `─────────────────────\n`;
    message += `Subtotal:   ₦${formatPrice(getTotalPrice())}\n`;
    const discount = getDiscountAmount();
    if (discount > 0) {
      message += `Discount:   -₦${formatPrice(discount)} (${couponCode || ""})\n`;
    }
    message += `TOTAL:      ₦${formatPrice(getTotalPrice() - discount)}\n`;
    message += `─────────────────────\n\n`;

    if (data.orderNotes) {
      message += `📝 Notes: ${data.orderNotes}\n\n`;
    }

    message += `Sent via abundanceclothing.com`;

    const whatsappURL = getWhatsAppURL(message);
    window.open(whatsappURL, "_blank");

    setOrderPlaced(true);
    // In a real app, you would clear the cart here or store the order
    // cart.clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gold-primary">
        <h1 className="text-4xl font-bebas-neue mb-4">Order Sent!</h1>
        <p className="text-lg text-text-secondary mb-8">
          Your order has been sent to Abundance Clothing via WhatsApp. We'll
          contact you shortly to confirm.
        </p>
        <Link href="/shop">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const grandTotal = subtotal - discountAmount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bebas-neue text-gold-primary mb-8 text-center">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <h2 className="text-2xl font-bebas-neue text-text-primary mb-6 border-b border-border-subtle pb-2">
            Your Details
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              id="fullName"
              {...register("fullName")}
              error={errors.fullName?.message}
            />
            <Input
              label="Phone Number"
              type="tel"
              id="phoneNumber"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
            <Input
              label="Email Address (Optional)"
              type="email"
              id="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Delivery Address"
              type="textarea"
              id="deliveryAddress"
              {...register("deliveryAddress")}
              error={errors.deliveryAddress?.message}
            />
            <Input
              label="State"
              type="text"
              id="state"
              {...register("state")}
              error={errors.state?.message}
            />
            <Input
              label="City"
              type="text"
              id="city"
              {...register("city")}
              error={errors.city?.message}
            />
            <Input
              label="Order Notes (Optional)"
              type="textarea"
              id="orderNotes"
              {...register("orderNotes")}
            />
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-bebas-neue text-text-primary mb-6 border-b border-border-subtle pb-2">
            Order Summary
          </h2>
          <Card accent>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex items-center mb-4 last:mb-0"
              >
                <div className="w-20 h-20 relative mr-4 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-text-primary text-lg">{item.name}</h3>
                  <p className="text-text-secondary text-sm">
                    {item.size} / {item.color}
                  </p>
                  <p className="text-gold-primary text-sm">
                    {item.quantity} x ₦{formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-text-primary font-mono text-lg">
                  ₦{formatPrice(item.quantity * item.price)}
                </span>
              </div>
            ))}

            <div className="border-t border-border-subtle mt-4 pt-4 text-sm font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">
                  Subtotal ({getItemCount()} items)
                </span>
                <span className="text-text-primary">
                  ₦{formatPrice(subtotal)}
                </span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-gold-primary">
                  <span>Discount ({couponCode})</span>
                  <span>-₦{formatPrice(discountAmount)}</span>
                  <Button
                    variant="outline"
                    onClick={removeCoupon}
                    className="text-xs ml-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold font-bebas-neue pt-2 border-t border-border-subtle">
                <span className="text-gold-primary">Total</span>
                <span className="text-gold-primary">
                  ₦{formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-bebas-neue text-text-primary mb-3">
              Apply Coupon
            </h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                error={couponError}
              />
              <Button
                variant="secondary"
                onClick={handleApplyCoupon}
                disabled={!couponCode}
              >
                Apply
              </Button>
            </div>
          </div>

          <p className="text-text-secondary text-sm mt-6 mb-4 leading-relaxed">
            <em className="text-gold-primary">
              "We're almost done! Click below to send your order to us on
              WhatsApp. We'll confirm availability and payment details within a
              few hours."
            </em>
          </p>
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Send Order on WhatsApp →
          </Button>
        </div>
      </div>
    </div>
  );
}
