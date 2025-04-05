import { SidebarContent, SidebarProvider } from "@/components/ui/Sidebar";
import { Sidebar } from "@/components/ui/SideBar";
import { Mic } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import SessionsList from "./SessionsList";
import { Input } from "../ui/input";

export default function AdminDashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <div className="relative left-0 flex h-full w-full flex-col border-r-1 border-[var(--color-primary-200)] bg-[var(--color-primary-100)] shadow-lg">
            {/* Header */}
            <div className="px-3 pt-3">
              <h2 className="text-2xl font-bold">Sessions</h2>
            </div>
            {/* Search bar */}
            <div className="relative my-4 flex items-center pr-5 pl-3">
              <FaSearch className="absolute ml-2 text-[var(--color-primary-400)] opacity-80" />
              <Input
                type="text"
                placeholder="Search"
                className="relative w-full rounded-md border-1 border-[var(--color-primary-200)] px-1 py-2.5 indent-7.5 placeholder-[var(--color-primary-400)]"
              />
            </div>
            {/* Sessions List */}
            <SessionsList />
            <div className="absolute bottom-0 left-0 flex h-20 w-full items-center justify-center border-t-1 border-[var(--color-primary-200)] px-4 font-semibold">
              <button
                type="button"
                className="relative w-full cursor-pointer rounded-md border-1 border-[var(--color-primary-200)] py-2 transition-all hover:text-gray-600"
              >
                <div className="flex items-center justify-center gap-3">
                  <Mic size={16} />
                  <p>Tidy up</p>
                </div>
              </button>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
      <main className="flex h-screen w-full flex-col overflow-hidden">
        {children}
      </main>
    </SidebarProvider>
  );
}
