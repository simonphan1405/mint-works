"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { createAppStore, type AppStore } from "@/store/store";
import type { ReactNode } from "react";
import type { RootState } from "@/store/store";

export function ReduxProvider({
  children,
  preloadedState,
}: {
  children: ReactNode;
  preloadedState?: Partial<RootState>;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAppStore(preloadedState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
