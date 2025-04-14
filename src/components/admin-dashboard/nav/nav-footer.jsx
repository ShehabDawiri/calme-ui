import React from "react";
import { CircleDollarSign, Map, Command, CircleHelp } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
const footerItems = [
  { title: "Earn 50$", url: "#", icon: CircleDollarSign },
  { title: "Roadmap", url: "#", icon: Map },
  { title: "Shortcuts", url: "#", icon: Command },
];

const Navfooter = () => {
  const { open: isOpen } = useSidebar();
  return (
    <SidebarFooter className="bg-primary-100 flex justify-between border-t p-2">
      {footerItems.map((item, index) => (
        <SidebarMenuButton key={index} asChild>
          <a
            href={item.url}
            className="hover:bg-primary-200 text-primary-400 rounded-lg p-2"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.title}</span>
          </a>
        </SidebarMenuButton>
      ))}
      <Button
        className={`${isOpen ? "w-full" : "size-8"} border-primary-200 bg-primary-100 text-primary-500 hover:bg-hover-100 focus:ring-primary-500 focus:ring-opacity-50 flex cursor-pointer items-center justify-center rounded-md border-1`}
      >
        <CircleHelp />
        {isOpen && "Help"}
      </Button>
    </SidebarFooter>
  );
};

export default Navfooter;
