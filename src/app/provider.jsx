"use client";

import { HeroUIProvider } from "@heroui/react";
import React from "react";

export default function Provider({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
