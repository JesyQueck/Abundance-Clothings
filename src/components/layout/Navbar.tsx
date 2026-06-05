"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useHydrated } from "@/hooks/useHydrated";
import { ShoppingBag, Heart, Menu, X, Search } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const hydrated = useHydrated();
  const { getItemCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();

  const cartCount = hydrated ? getItemCount() : 0;
  const wishlistCount = hydrated ? getWishlistCount() : 0;

  // close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-background-deep border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="font-display text-lg md:text-2xl tracking-widest">
              <span className="text-gold-primary">ABUNDANCE</span>
              <span className="text-text-primary text-sm md:text-lg ml-1 md:ml-2">CLOTHING</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/shop"
              className="text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider"
            >
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/wishlist"
              className="relative text-text-secondary hover:text-gold-primary transition-colors"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-primary text-background-deep text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative text-text-secondary hover:text-gold-primary transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-primary text-background-deep text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-text-secondary hover:text-gold-primary transition-colors"
              aria-expanded={isOpen}
              aria-label="Open menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 w-64 h-full bg-background-surface border-l border-border-subtle p-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-gold-primary uppercase tracking-wider"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-gold-primary uppercase tracking-wider"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-gold-primary uppercase tracking-wider"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="bg-background-surface border-t border-border-subtle px-4 py-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 bg-background-raised border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-gold-primary focus:outline-none"
            autoFocus
          />
        </div>
      )}
    </nav>
  );
}
