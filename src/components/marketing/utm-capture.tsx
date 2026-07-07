"use client";

import { useEffect } from "react";
import { captureUtmParams } from "@/lib/utm";

/** Captures campaign params on landing (mounted once in the root layout). */
export function UtmCapture() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return null;
}
