import type { Metadata } from "next";
import AdminBodyClass from "@/components/AdminBodyClass";

export const metadata: Metadata = {
  title: "Admin CPanel | Jawad Portfolio",
  description: "Portfolio content management panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Injects body.admin-page class to restore cursor in admin */}
      <AdminBodyClass />
      {children}
    </>
  );
}
