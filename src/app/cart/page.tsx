"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    total,
    applyCoupon,
    couponCode,
    removeCoupon,
  } = useCart();

  const handleApplyCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("coupon") as string;
    applyCoupon(code);
  };

  if (items.length === 0) {
    return (
      <div className="bg-background-deep min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-4xl tracking-widest mb-8">
            <span className="text-gold-primary">YOUR CART</span>
          </h1>
          <p className="text-text-secondary mb-8">Your cart is empty.</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-deep min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl tracking-widest mb-8">
          <span className="text-gold-primary">YOUR CART</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="bg-background-raised border border-border-subtle p-4 flex gap-4"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg tracking-wider text-text-primary mb-1">
                    {item.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-2">
                    {item.size} / {item.color}
                  </p>
                  <p className="text-gold-primary font-display text-lg mb-3">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-8 h-8 bg-background-surface border border-border-subtle flex items-center justify-center hover:border-gold-primary transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity + 1,
                          )
                        }
                        className="w-8 h-8 bg-background-surface border border-border-subtle flex items-center justify-center hover:border-gold-primary transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl text-text-primary">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-background-raised border border-border-subtle p-6 h-fit">
            <h2 className="font-display text-2xl tracking-widest mb-6">
              <span className="text-gold-primary">SUMMARY</span>
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-border-subtle pt-3 flex justify-between font-display text-xl text-text-primary">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <form onSubmit={handleApplyCoupon} className="mb-6">
              <Input
                name="coupon"
                placeholder="Enter coupon code"
                defaultValue={couponCode || ""}
              />
              {couponCode && (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-red-500 text-sm mt-2 hover:underline"
                >
                  Remove coupon
                </button>
              )}
              <Button type="submit" size="md" className="w-full mt-2">
                Apply Coupon
              </Button>
            </form>

            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>

            <Link
              href="/shop"
              className="block text-center mt-4 text-text-secondary hover:text-gold-primary transition-colors text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
