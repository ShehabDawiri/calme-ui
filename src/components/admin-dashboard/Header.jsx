import React from "react";
import { Play, Mic, Calendar, User, Languages, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const buttonData = [
  { icon: <User className="h-4 w-4" />, text: "Add pt details" },
  { icon: <Calendar className="h-4 w-4" />, text: "13/06/2021 10:30am" },
  { icon: <Languages className="h-4 w-4" />, text: "en" },
  { icon: <Timer className="h-4 w-4" />, text: "00:00:04" },
  { icon: <Mic className="h-4 w-4" />, text: "" },
  { icon: <Play className="h-4 w-4" />, text: "Resume" },
];

const Header = () => {
  return (
    <div className="flex h-20 w-full items-center justify-between py-3">
      <div className="flex h-full w-full flex-wrap items-center justify-between gap-2">
        {/* Left side */}
        <div className="left flex flex-wrap items-center gap-2">
          {buttonData.slice(0, 3).map((button, index) => (
            <Button
              key={index}
              className="bg-primary-100 text-primary-500 hover:bg-primary-200 border-primary-200 flex items-center gap-2 rounded-md border-1"
            >
              {button.icon}
              <span className="hidden md:inline">{button.text}</span>
            </Button>
          ))}
        </div>

        {/* Right side */}
        <div className="right flex flex-wrap items-center gap-2">
          {buttonData.slice(3).map((button, index) => (
            <Button
              key={index}
              className={`text-primary-500 border-primary-200 flex items-center gap-2 rounded-md ${
                button.text === "Resume"
                  ? "text-primary-100 bg-green-500 hover:bg-green-600"
                  : "bg-primary-100 hover:bg-primary-200 border-1"
              }`}
            >
              {button.icon}

              {button.text && (
                <span className="hidden md:inline">{button.text}</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
