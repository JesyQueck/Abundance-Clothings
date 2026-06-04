# Abundance Clothing

A premium streetwear e-commerce application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. The brand embodies the slogan **"Focus. Grow. Flourish."** with a design aesthetic that blends industrial brutalism with premium streetwear.

## Features

### Customer-Facing Features
- **Homepage**: Hero section, featured collections, and featured products
- **Shop Page**: Product grid with category filters and search functionality
- **Product Detail Page**: Image gallery, variant selection (size/color), add to cart, and wishlist
- **Cart Page**: Item management, quantity updates, and coupon code application
- **Checkout**: Form validation with WhatsApp order integration
- **Wishlist**: Save favorite products for later
- **About & Contact Pages**: Brand information and contact form

### Admin Panel
- **Admin Login**: Password-protected admin access
- **Dashboard**: Overview with analytics (total products, orders, stock status, bestselling items)
- **Product Management**: Full CRUD operations for products and variants
- **Order Management**: View orders, update order status
- **Coupon Management**: Create, edit, and manage discount codes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context API (useReducer for cart, useState for wishlist)
- **Forms**: react-hook-form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   ├── product/[slug]/    # Dynamic product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout with WhatsApp integration
│   ├── wishlist/          # Wishlist page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/            # Navbar, Footer
│   └── ui/                # Reusable UI components
├── context/               # React Context providers
│   ├── CartContext.tsx    # Shopping cart state
│   └── WishlistContext.tsx # Wishlist state
├── lib/                   # Utility functions
│   ├── db.ts              # Supabase data access layer
│   ├── supabase.ts        # Supabase client
│   ├── utils.ts           # Helper functions
│   └── whatsapp.ts        # WhatsApp integration
├── types/                 # TypeScript type definitions
│   └── index.ts
└── app/
    ├── globals.css        # Global styles
    └── layout.tsx         # Root layout
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (free tier works)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/JesyQueck/Abundance-Clothings.git
cd Abundance-Clothing
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the following SQL script to create the database tables:

```sql
-- Enable the "uuid-ossp" extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2),
    category TEXT NOT NULL,
    tags TEXT[],
    images TEXT[],
    material TEXT,
    care TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Product Variants
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    UNIQUE (product_id, size, color)
);

-- Table for Coupons
CREATE TABLE coupons (
    code TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    value NUMERIC(10, 2) NOT NULL,
    expiry TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    delivery_address TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    order_notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    coupon_code TEXT REFERENCES coupons(code) ON DELETE SET NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Received' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    product_image TEXT,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Newsletter Signups
CREATE TABLE newsletter_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone." ON products
  FOR SELECT USING (true);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public product variants are viewable by everyone." ON product_variants
  FOR SELECT USING (true);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public coupons are viewable by everyone." ON coupons
  FOR SELECT USING (true);

ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Newsletter signups can be created by anyone." ON newsletter_signups
  FOR INSERT WITH CHECK (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin access to orders" ON orders FOR ALL USING (true);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin access to order items" ON order_items FOR ALL USING (true);

-- Required for admin product CRUD (see supabase/admin-products-rls.sql)
CREATE POLICY "Allow product writes" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow product variant writes" ON product_variants FOR ALL USING (true) WITH CHECK (true);
```

4. Enable Realtime for the following tables in your Supabase dashboard:
   - products
   - product_variants
   - orders
   - order_items
   - newsletter_signups

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WA_NUMBER=2348000000000
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get your Supabase credentials from:
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → anon/public key

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **Admin Login URL**: `/admin-login`
- **Default Password**: `admin123` (change this in production)

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all the variables from `.env.local`

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and click "Add New Project"
3. Import your GitHub repository
4. Add environment variables in the deployment settings
5. Click "Deploy"

### Environment Variables for Vercel

Add these in your Vercel project settings:

```
NEXT_PUBLIC_WA_NUMBER=2348000000000
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Colors
- **Gold Primary**: `#C8A84B`
- **Background Deep**: `#0F0C0A`
- **Background Raised**: `#1A1714`
- **Text Primary**: `#F5F0E8`
- **Text Secondary**: `#B0A898`
- **Border Subtle**: `#2A2520`

### Fonts
- **Display**: Bebas Neue (headings)
- **Body**: Inter (body text)
- **Mono**: monospace (labels, tags)

## Order Flow

1. Customer browses products and adds items to cart
2. Customer proceeds to checkout
3. Customer fills in delivery details
4. Order is sent via WhatsApp with all order details
5. Admin receives order and updates status in admin panel
6. Order status changes: Received → Processing → Packed → Shipped → Delivered

## Future Enhancements (Phase 2)

- User authentication with Supabase Auth
- Order history for logged-in users
- Real-time order tracking
- Payment gateway integration (Paystack, Flutterwave)
- Advanced analytics dashboard
- Email notifications
- Product reviews and ratings
- Size recommendation system

## License

This project is proprietary and confidential.

## Support

For support, contact info@abundanceclothing.com or reach out via WhatsApp.
