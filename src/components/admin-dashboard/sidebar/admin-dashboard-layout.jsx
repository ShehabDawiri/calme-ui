import { SidebarProvider } from "@/components/ui/Sidebar";

import { AppSidebar } from "@/components/admin-dashboard/sidebar/app-sidebar";

export default function AdminDashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar className="hidden lg:flex" collapsible="icon"></AppSidebar>
      <main className="flex h-screen w-full flex-col">{children}</main>
    </SidebarProvider>
  );
}
