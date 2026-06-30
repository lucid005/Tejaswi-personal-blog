import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin | Tejaswi Blog",
  description: "Admin dashboard for Tejaswi Blog.",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
