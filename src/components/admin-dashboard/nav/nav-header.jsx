import React from "react";
import { NavUser } from "@/components/admin-dashboard/nav/nav-user";
import { SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar";

const Navheader = () => {
  return (
    <SidebarHeader
      className={
        "border-b-primary-200 bg-primary-100 flex items-center justify-between border-b px-4 py-2"
      }
    >
      <div className="flex items-center justify-center">
        <NavUser
          user={{
            avatar: "/images/avatar.png",
            name: "John Doe",
            email: "johndoe@gmail.com",
          }}
        />
        <SidebarTrigger />
      </div>
    </SidebarHeader>
  );
};

export default Navheader;
