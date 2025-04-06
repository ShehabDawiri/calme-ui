import React from "react";
import { Input } from "@/components/ui/input";

const ChatInput = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="input relative h-full w-full">
        <Input
          type={"text"}
          placeholder="Ask Calmé to do anything..."
          className="bg-primary-100 h-full w-full rounded-4xl indent-12"
        ></Input>
        <div className="absolute bottom-1/2 left-0 ml-4 size-8 translate-y-1/2 rounded-full bg-pink-300"></div>
      </div>
    </div>
  );
};

export default ChatInput;
