'use client'

import useCart from "@/lib/cart";
import { Button } from "@heroui/react";
import React from "react";
import toast from "react-hot-toast";

export default function ButtonAddComponent({ product }) {
  const addToCart = useCart((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    addToCart({
      id: product.productId,
      quantity: 1
    });

    toast.success(`${product.name || 'Product'} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      isIconOnly
      aria-label="Add to cart"
      className="size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95"
    >
      +
    </Button>
  );
}