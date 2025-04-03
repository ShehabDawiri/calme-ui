import React from "react";
import { Separator } from "../ui/Separator";

const TabMenu = () => {
  return (
    <>
      <Separator />
      <div className="flex h-16 w-full items-center justify-between bg-[var(--color-primary-100)] px-4 shadow-lg">
        <div className="flex h-full w-full items-center justify-between">
          <div className="left flex h-full items-center gap-2 font-normal"></div>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default TabMenu;
