import Header from "../../components/admin-dashboard/Header";
import TabMenu from "../../components/admin-dashboard/TabMenu";
import AdminDashboardLayout from "@/components/admin-dashboard/admin-dashboard-layout";
import ChatInput from "@/components/admin-dashboard/ChatInput ";

export default function AdminDashboard() {
  return (
    <div className="h-[100dvh] w-[100dvw]">
      <AdminDashboardLayout>
        {/* Header */}
        <div className="grid h-full w-full grid-flow-row-dense grid-rows-30">
          <Header />
          {/* Tab Menu */}
          <TabMenu />
          {/* Footer Controls */}
          <div className="bg-primary-100 border-primary-200 row-span-3 flex h-full w-full items-center justify-between border-t-1 px-4 py-4">
            <ChatInput />
          </div>
        </div>
      </AdminDashboardLayout>
    </div>
  );
}
