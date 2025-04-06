import { Play, Mic, PlusIcon, Calendar, Languages, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/SideBar";
import { Separator } from "@/components/ui/Separator";
import React from "react";

const Header = () => {
  return (
    <div className="bg-primary-100 row-span-2 flex w-full items-center justify-between px-4">
      <div className="flex h-fit w-full items-center justify-between">
        <div className="left flex h-fit items-center gap-2 font-normal">
          <SidebarTrigger className="bg-accent" />
          <Separator orientation="vertical" className="py-4" />
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-[var(--color-primary-200)] bg-[var(--color-primary-100)] px-4 py-2 text-[var(--color-primary-500)]"
          >
            <PlusIcon size={16} className="" color="var(--color-primary-500)" />
            New Session
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-[var(--color-primary-200)] bg-[var(--color-primary-100)] px-4 py-2 text-[var(--color-primary-500)]"
          >
            <User size={16} className="" color="var(--color-primary-500)" />
            Add pt details
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-[var(--color-primary-200)] bg-[var(--color-primary-100)] px-4 py-2 text-[var(--color-primary-500)]"
          >
            <Calendar size={16} />
            13/06/2021 10:30am
          </button>
          {/* <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-[var(--color-primary-200)] bg-[var(--color-primary-100)] px-4 py-2 text-[var(--color-primary-500)]"
          >
            <Languages size={16} />
            en
          </button> */}
        </div>
        <div className="right flex h-full items-center gap-2 font-normal">
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md bg-[var(--color-primary-500)] px-4 py-2 text-[var(--color-primary-100)]"
          >
            <Play size={16} className="" color="var(--color-primary-100)" />
            Create
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-[var(--color-primary-200)] bg-[var(--color-primary-100)] px-4 py-2 text-[var(--color-primary-500)]"
          >
            <Play size={16} className="" color="var(--color-primary-500)" />
            00:00:04
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-[var(--color-primary-200)] bg-[var(--color-primary-100)] px-4 py-3 text-[var(--color-primary-500)]"
          >
            <Mic size={16} />
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-md border-[1px] border-[var(--color-primary-200)] bg-[var(--color-primary-100)] px-4 py-2 text-[var(--color-primary-500)]"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
