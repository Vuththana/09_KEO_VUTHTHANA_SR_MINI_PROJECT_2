'use client'

import { Button } from "@heroui/react";
import React from "react";

export default function ButtonAddComponent() {
  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      className={`size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95}`}
    >
      +
    </Button>
  );
}
