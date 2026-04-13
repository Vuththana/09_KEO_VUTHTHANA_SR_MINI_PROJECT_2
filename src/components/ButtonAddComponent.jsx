'use client'

import useCart from "@/lib/cart";
import { Button } from "@heroui/react";
import React from "react";
import { create } from "zustand";


export default function ButtonAddComponent({ productId }) {
  const addToCart = useCart((state) => state.addToCart);

  return (
    <Button
      onClick={() => {
        addToCart({id: productId})
      }}
      isIconOnly
      aria-label="Add to cart"
      className={`size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95}`}
    >
      +
    </Button>
  );
}
