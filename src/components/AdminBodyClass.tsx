"use client";
import { useEffect } from "react";

/**
 * Adds "admin-page" class to <body> and forces dark mode 
 * specifically for the CPanel, regardless of the site's global theme.
 */
export default function AdminBodyClass() {
  useEffect(() => {
    // Capture original theme state
    const originalTheme = document.documentElement.getAttribute("data-theme");
    const originalHasDarkClass = document.documentElement.classList.contains("dark");

    // Force Dark Mode for Admin
    document.body.classList.add("admin-page");
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");

    return () => {
      // Restore previous state
      document.body.classList.remove("admin-page");
      if (originalTheme) {
        document.documentElement.setAttribute("data-theme", originalTheme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      
      if (originalHasDarkClass) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
  }, []);
  return null;
}
