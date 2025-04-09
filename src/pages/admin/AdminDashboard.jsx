import Header from "../../components/admin-dashboard/Header";
import TabMenu from "../../components/admin-dashboard/TabMenu";
import AdminDashboardLayout from "@/components/admin-dashboard/sidebar/admin-dashboard-layout";
import ChatInput from "@/components/admin-dashboard/ChatInput ";

export default function AdminDashboard() {
  return (
    <div className="h-[100dvh] w-[100dvw]">
      <AdminDashboardLayout>
        <div className="bg-background-100 flex h-full w-full flex-col px-8 py-4">
          <Header />
          <TabMenu />
          <ChatInput />
        </div>
      </AdminDashboardLayout>
    </div>
  );
}
