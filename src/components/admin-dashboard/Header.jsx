import React from "react";
import { Play, Mic, PlusIcon, Calendar, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/SideBar";
import { Separator } from "@/components/ui/Separator";
import HeaderButton from "./HeaderButton";

const Header = () => {
  return (
    <div className="bg-primary-100 flex h-20 w-full items-center justify-between px-4 py-3">
      <div className="flex h-full w-full items-center justify-between">
        {/* Left side */}
        <div className="left flex h-full items-center gap-2">
          <SidebarTrigger className="bg-primary-100" />
          <Separator orientation="vertical" className="py-4" />
          {/* Buttons */}
          <HeaderButton theme="light">
            <PlusIcon className="" />
            New Session
          </HeaderButton>
          <HeaderButton theme="light">
            <User className="" />
            Add pt details
          </HeaderButton>
          <HeaderButton theme="light">
            <Calendar />
            13/06/2021 10:30am
          </HeaderButton>
        </div>

        {/* Right side */}
        <div className="right flex h-full items-center gap-2">
          <HeaderButton theme="dark">
            <Play className="" />
            Create
          </HeaderButton>
          <HeaderButton theme="light">
            <Play className="" />
            00:00:04
          </HeaderButton>
          <HeaderButton theme="light">
            <Mic />
          </HeaderButton>
          <HeaderButton theme="light">Resume</HeaderButton>
        </div>
      </div>
    </div>
  );
};

export default Header;
