import React from "react";
import { NavUser } from "@/components/admin-dashboard/nav/nav-user";
import { SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar";
import { useAuth0 } from "@auth0/auth0-react";

const Navheader = () => {
  const { user } = useAuth0();

  return (
    <SidebarHeader
      className={
        "border-b-primary-200 bg-primary-100 flex items-center justify-between border-b px-4 py-2"
      }
    >
      <div className="flex items-center justify-center">
        <NavUser
          user={{
            avatar: user.picture,
            name: user.name,
            email: user.email,
          }}
        />
        <SidebarTrigger />
      </div>
    </SidebarHeader>
  );
};

export default Navheader;
