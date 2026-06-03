"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingBag, Heart, Menu, X, Search } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getItemCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  return (
    <nav className="sticky top-0 z-40 bg-background-deep border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="font-display text-2xl tracking-widest">
              <span className="text-gold-primary">ABUNDANCE</span>
              <span className="text-text-primary text-lg ml-2">CLOTHING</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider">
              Shop
            </Link>
            <Link href="/about" className="text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider">
              About
            </Link>
            <Link href="/contact" className="text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider">
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
           {/*  <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-text-secondary hover:text-gold-primary transition-colors"
            >
              <Search size={20} />
            </button> */}
            <Link href="/wishlist" className="relative text-text-secondary hover:text-gold-primary transition-colors">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-primary text-background-deep text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative text-text-secondary hover:text-gold-primary transition-colors">
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
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background-surface border-t border-border-subtle">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/shop"
              className="block text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider py-2"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-text-secondary hover:text-gold-primary transition-colors text-sm uppercase tracking-wider py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
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
