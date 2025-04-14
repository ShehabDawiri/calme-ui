import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/Sidebar";
import { NavMain } from "@/components/admin-dashboard/nav/nav-main";
import { PlusCircle, Bell, UserRoundSearch, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Navfooter from "../nav/nav-footer";
import Navheader from "../nav/nav-header";
import { useModalStore } from "@/hooks/modalStore";

export function AppSidebar({ ...props }) {
  const { open: isOpen } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <Navheader />
      <SidebarContent className={"bg-primary-100 py-4"}>
        <div
          className={`relative flex ${isOpen ? "h-10 w-full px-2" : "h-fit flex-col"} bg-primary-100 w-full items-center justify-around gap-2`}
        >
          <Button
            className={`${isOpen ? "flex-1" : "size-8"}`}
            onClick={() => useModalStore.getState().openRecordModal()}
          >
            <PlusCircle /> {isOpen && "New Session"}
          </Button>
          <Button
            className={`${isOpen ? "w-10" : "size-8"} border-primary-200 bg-primary-100 text-primary-500 hover:bg-hover-100 focus:ring-primary-500 focus:ring-opacity-50 flex cursor-pointer items-center justify-center rounded-md border-1`}
          >
            <Bell />
          </Button>
        </div>
        <div className="flex w-full items-center justify-center px-2">
          <Button
            className={`${isOpen ? "h-fit w-full" : "size-8"} border-primary-200 bg-accent-100 text-primary-400 hover:bg-accent-200 focus:ring-primary-500 focus:ring-opacity-50 flex cursor-pointer items-center justify-center rounded-md`}
          >
            <div
              className={`${isOpen ? "flex h-full w-full items-center gap-2 overflow-hidden text-nowrap" : null} `}
            >
              <UserRoundSearch />
              {isOpen && <p>Show sessions</p>}
            </div>
            {isOpen && <ChevronRight />}
          </Button>
        </div>
        <NavMain />
      </SidebarContent>
      <Navfooter />
      <SidebarRail />
    </Sidebar>
  );
}
