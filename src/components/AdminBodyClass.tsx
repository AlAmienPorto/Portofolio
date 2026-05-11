"use client";
import { useEffect } from "react";

/**
 * Adds "admin-page" class to <body> so the global CSS can restore
 * normal system cursors inside admin (overriding cursor:none).
 */
export default function AdminBodyClass() {
  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);
  return null;
}
