"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product, ProductVariant } from "@/types";
import { getCouponByCode } from "@/lib/db";

type CartState = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | {
      type: "REMOVE_ITEM";
      payload: { productId: string; size: string; color: string };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        size: string;
        color: string;
        quantity: number;
      };
    }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number } }
  | { type: "REMOVE_COUPON" }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  total: number;
  addItem: (
    product: Product,
    variant: ProductVariant,
    quantity: number,
  ) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  applyCoupon: (
    code: string,
  ) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateDiscount(subtotal: number, discountValue: number): number {
  return Math.round(subtotal * (discountValue / 100));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color,
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const subtotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const discount = state.couponCode
        ? calculateDiscount(subtotal, state.discount)
        : 0;

      return { ...state, items: newItems, subtotal, discount };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          ),
      );
      const subtotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const discount = state.couponCode
        ? calculateDiscount(subtotal, state.discount)
        : 0;

      return { ...state, items: newItems, subtotal, discount };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.productId === action.payload.productId &&
        item.size === action.payload.size &&
        item.color === action.payload.color
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
      const subtotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const discount = state.couponCode
        ? calculateDiscount(subtotal, state.discount)
        : 0;

      return { ...state, items: newItems, subtotal, discount };
    }

    case "CLEAR_CART":
      return { items: [], subtotal: 0, discount: 0, couponCode: null };

    case "APPLY_COUPON":
      const discount = calculateDiscount(
        state.subtotal,
        action.payload.discount,
      );
      return { ...state, couponCode: action.payload.code, discount };

    case "REMOVE_COUPON":
      return { ...state, couponCode: null, discount: 0 };

    case "LOAD_CART":
      const loadedSubtotal = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return {
        items: action.payload,
        subtotal: loadedSubtotal,
        discount: 0,
        couponCode: null,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    discount: 0,
    couponCode: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("abundance_cart");
    if (saved) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("abundance_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (
    product: Product,
    variant: ProductVariant,
    quantity: number,
  ) => {
    const cartItem: CartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      quantity,
      price: product.salePrice || product.price,
    };
    dispatch({ type: "ADD_ITEM", payload: cartItem });
  };

  const removeItem = (productId: string, size: string, color: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, size, color } });
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, size, color, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const applyCoupon = async (code: string) => {
    const coupon = await getCouponByCode(code);
    if (!coupon) return { success: false, message: "Invalid coupon" };
    dispatch({
      type: "APPLY_COUPON",
      payload: { code: coupon.code, discount: coupon.value },
    });
    return { success: true };
  };

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" });
  };

  const getItemCount = () =>
    state.items.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => state.subtotal;
  const getDiscountAmount = () => state.discount;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        subtotal: state.subtotal,
        discount: state.discount,
        couponCode: state.couponCode,
        total: state.subtotal - state.discount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        getItemCount,
        getTotalPrice,
        getDiscountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
