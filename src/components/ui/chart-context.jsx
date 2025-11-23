"use client";

import { createContext, useContext } from "react";

export const ChartContext = createContext(null);

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}
