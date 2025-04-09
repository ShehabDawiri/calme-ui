import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/Sidebar";
import { Sidebar } from "@/components/ui/SideBar";
import { Mic } from "lucide-react";
import SessionsList from "./SessionsList";
import { Button } from "@/components/ui/Button";
import Searchbar from "./Searchbar";

export default function AdminDashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <Sidebar className={"border-primary-200 bg-primary-100 relative"}>
        {/* Header */}
        <SidebarHeader
        // className={
        //   "bg-primary-100 border-primary-200 flex h-fit w-full flex-col justify-around gap-4 border-b-1"
        // }
        >
          <h2 className="text-2xl font-bold">Sessions</h2>
          {/* Search bar */}
          <Searchbar />
        </SidebarHeader>
        {/* Content */}
        <SidebarContent
          className={
            "bg-primary-100 flex h-full w-full items-center justify-center"
          }
        >
          {/* Sessions List */}
          <SessionsList />
        </SidebarContent>
        <SidebarFooter
          className={
            "border-primary-200 flex h-20 w-full items-center justify-center border-t-1 bg-transparent p-0 px-4 font-semibold"
          }
        >
          <Button
            type="button"
            className="relative w-full cursor-pointer rounded-md py-5"
          >
            <div className="flex items-center justify-center gap-3">
              <Mic />
              <p>Tidy up</p>
            </div>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="flex h-screen w-full flex-col">{children}</main>
    </SidebarProvider>
  );
}
