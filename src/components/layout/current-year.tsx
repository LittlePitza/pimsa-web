"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();

/**
 * Copyright year that stays current on fully static pages: the build-time
 * year renders on the server, and useSyncExternalStore swaps in the real
 * year on the client if a new year arrived without a redeploy.
 */
export function CurrentYear({ serverYear }: { serverYear: number }) {
  const year = useSyncExternalStore(subscribe, getYear, () => serverYear);
  return <>{year}</>;
}
