import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background-surface border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="font-display text-2xl tracking-widest mb-4">
              <span className="text-gold-primary">ABUNDANCE</span>
              <br />
              <span className="text-text-primary text-lg">CLOTHING</span>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Focus. Grow. Flourish.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-gold-primary text-lg tracking-wider mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-text-secondary hover:text-gold-primary transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens" className="text-text-secondary hover:text-gold-primary transition-colors text-sm">
                  Men&apos;s Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=womens" className="text-text-secondary hover:text-gold-primary transition-colors text-sm">
                  Women&apos;s Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="text-text-secondary hover:text-gold-primary transition-colors text-sm">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-gold-primary text-lg tracking-wider mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-gold-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-gold-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-text-secondary hover:text-gold-primary transition-colors text-sm">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-gold-primary text-lg tracking-wider mb-4">CONTACT</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>Lagos, Nigeria</li>
              <li>WhatsApp: +234 800 000 0000</li>
              <li>info@abundanceclothing.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-8 pt-8 text-center">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Abundance Clothing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
