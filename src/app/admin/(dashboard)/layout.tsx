import AdminSidebar from "@/components/admin/AdminSidebar";

export const runtime = "edge";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</div>
    </div>
  );
}
