import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getFeaturedProductsForHome } from "@/lib/db";
import { isMockProduct } from "@/lib/mockProducts";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProductsForHome();

  return (
    <div className="bg-background-deep">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-deep z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1920')] bg-cover bg-center opacity-30" />
        <div className="relative z-20 text-center px-4">
          <h1 className="font-display text-6xl md:text-8xl tracking-widest mb-4">
            <span className="text-gold-primary">ABUNDANCE</span>
          </h1>
          <p className="font-display text-3xl md:text-4xl tracking-wider text-text-primary mb-8">
            Focus. Grow. Flourish.
          </p>
          <Link href="/shop">
            <Button size="lg">Shop Collection</Button>
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl tracking-widest text-center mb-12">
            <span className="text-gold-primary">COLLECTIONS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/shop?category=mens" className="group relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10 h-full flex items-center justify-center">
                <h3 className="font-display text-3xl tracking-widest text-white">MEN&apos;S WEAR</h3>
              </div>
            </Link>
            <Link href="/shop?category=womens" className="group relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10 h-full flex items-center justify-center">
                <h3 className="font-display text-3xl tracking-widest text-white">WOMEN&apos;S WEAR</h3>
              </div>
            </Link>
            <Link href="/shop?category=accessories" className="group relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10 h-full flex items-center justify-center">
                <h3 className="font-display text-3xl tracking-widest text-white">ACCESSORIES</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-background-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl tracking-widest text-center mb-3">
            <span className="text-gold-primary">FEATURED</span>
          </h2>
          <p className="text-center text-text-secondary text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Handpicked pieces from our latest drop — premium streetwear built to
            move with you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const href = isMockProduct(product)
                ? "/shop"
                : `/product/${product.slug}`;
              const displayPrice =
                product.salePrice != null ? product.salePrice : product.price;
              return (
                <Link key={product.id} href={href} className="group">
                  <div className="bg-background-raised border border-border-subtle overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg tracking-wider text-text-primary mb-2">
                        {product.name}
                      </h3>
                      <p className="text-text-secondary text-sm mb-3">
                        {product.salePrice != null && (
                          <span className="line-through text-text-muted mr-2">
                            {formatPrice(product.price)}
                          </span>
                        )}
                        {formatPrice(displayPrice)}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl tracking-widest mb-4">
            <span className="text-gold-primary">JOIN THE MOVEMENT</span>
          </h2>
          <p className="text-text-secondary mb-8">
            Subscribe for exclusive drops, early access, and special offers.
          </p>
          <form className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background-raised border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-gold-primary focus:outline-none"
            />
            <Button size="md">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
