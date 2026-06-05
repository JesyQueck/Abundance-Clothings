import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AppChrome } from "@/components/layout/AppChrome";

const bebas = localFont({
  src: [
    {
      path: "../../Bebas_Neue,DM_Sans,JetBrains_Mono/Bebas_Neue/BebasNeue-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = localFont({
  src: [
    {
      path: "../../Bebas_Neue,DM_Sans,JetBrains_Mono/DM_Sans/DMSans-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = localFont({
  src: [
    {
      path: "../../Bebas_Neue,DM_Sans,JetBrains_Mono/JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abundance Clothing | Focus. Grow. Flourish.",
  description: "Premium streetwear brand from Nigeria. Shop the latest collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="bg-background-deep text-text-primary font-sans antialiased">
        <CartProvider>
          <WishlistProvider>
            <AppChrome>{children}</AppChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
