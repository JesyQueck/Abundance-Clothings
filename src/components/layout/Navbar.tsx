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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 w-80 h-full bg-background-surface border-l border-border-subtle p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="font-display text-lg tracking-widest">
                <span className="text-gold-primary">ABUNDANCE</span>
                <span className="text-text-primary text-sm ml-2">CLOTHING</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-primary hover:text-gold-primary transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="text-text-primary hover:text-gold-primary text-xl uppercase tracking-wider font-display py-2 border-b border-border-subtle"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="text-text-primary hover:text-gold-primary text-xl uppercase tracking-wider font-display py-2 border-b border-border-subtle"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-text-primary hover:text-gold-primary text-xl uppercase tracking-wider font-display py-2 border-b border-border-subtle"
              >
                Contact
              </Link>
              <div className="pt-8 mt-8 border-t border-border-subtle">
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-text-primary hover:text-gold-primary py-3"
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-gold-primary text-background-deep text-xs px-2 py-1 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-text-primary hover:text-gold-primary py-3"
                >
                  <ShoppingBag size={20} />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-gold-primary text-background-deep text-xs px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
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
