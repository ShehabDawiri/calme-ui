import React from "react";
import { Button } from "@/components/ui/button";

const AppButton = ({ theme, children, props }) => {
  return (
    <Button
      type="button"
      {...props}
      className={` ${theme === "light" ? "bg-primary-100 hover:bg-hover-100 text-primary-500 focus:ring-primary-500 border-[1px]" : "text-primary-100"} focus:ring-opacity-50 h-full w-fit rounded-md font-semibold transition-colors duration-200 ease-in-out focus:ring-2 focus:outline-none`}
    >
      <div className="content flex h-full w-full items-center justify-center gap-2">
        {children}
      </div>
    </Button>
  );
};

export default AppButton;
