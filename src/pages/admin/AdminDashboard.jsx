import Header from "../../components/admin-dashboard/Header";
import TabMenu from "../../components/admin-dashboard/TabMenu";
import AdminDashboardLayout from "@/components/admin-dashboard/admin-dashboard-layout";
import ChatInput from "@/components/admin-dashboard/ChatInput ";

export default function AdminDashboard() {
  return (
    <div className="h-[100dvh] w-[100dvw]">
      <AdminDashboardLayout>
        <div className="flex h-full w-full flex-col">
          <Header />
          <TabMenu />
          <ChatInput />
        </div>
      </AdminDashboardLayout>
    </div>
  );
}
