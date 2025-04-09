import React from "react";
import { Input } from "@/components/ui/input";

const ChatInput = () => {
  return (
    <div className="bg-primary-100 border-primary-200 flex h-28 w-full items-center justify-between border-t-1 px-4 py-4">
      <div className="input relative h-full w-full">
        <Input
          type={"text"}
          placeholder="Ask Calmé to do anything..."
          className="bg-primary-100 h-full w-full rounded-4xl indent-12"
        />
        <div className="absolute bottom-1/2 left-0 ml-4 size-8 translate-y-1/2 rounded-full bg-pink-300"></div>
      </div>
    </div>
  );
};

export default ChatInput;
