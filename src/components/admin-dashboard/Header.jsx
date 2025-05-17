import React, { useEffect, useState } from "react";
import { Play, Mic, Calendar, User, Languages, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecordStore } from "@/hooks/useRecordingStore";
import { useModalStore } from "@/hooks/modalStore";
import { useSession } from "@/hooks/useSession";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const Header = () => {
  const { timer, isRecording, startRecording, stopRecording } =
    useRecordStore();
  const { openRecordModal } = useModalStore();
  const { sessionId } = useSession();

  const [microphones, setMicrophones] = useState([]);
  const [selectedMic, setSelectedMic] = useState(null);

  const formattedTime = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(
    timer % 60,
  ).padStart(2, "0")}`;


  useEffect(() => {
    const getMicrophones = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput",
        );
        setMicrophones(audioDevices);
        if (audioDevices.length > 0) {
          setSelectedMic(audioDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing microphones:", error);
      }
    };

    getMicrophones();
  }, []);

  // const handleResumeClick = () => {
  //   isRecording ? stopRecording() : startRecording(selectedMic);
  // };

  const handleStartClick = () => {
  if (sessionId) {
    startRecording(selectedMic); // Reuse session
  } else {
    openRecordModal(); // This leads to a new session creation
  }
};


  const handleResumeClick = () => {
    startRecording(selectedMic);
  };

  const handleStopClick = () => {
    stopRecording();
  };

  return (
    <div className="flex h-20 w-full items-center justify-between py-3">
      <div className="flex h-full w-full flex-wrap items-center justify-between gap-2">
        {/* Left Side */}
        <div className="left flex flex-wrap items-center gap-2">
          <Button className="bg-primary-100 text-primary-500 hover:bg-primary-200 border-primary-200 flex items-center gap-2 rounded-md border">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Add pt details</span>
          </Button>
          <Button className="bg-primary-100 text-primary-500 hover:bg-primary-200 border-primary-200 flex items-center gap-2 rounded-md border">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">13/06/2021 10:30am</span>
          </Button>
          <Button className="bg-primary-100 text-primary-500 hover:bg-primary-200 border-primary-200 flex items-center gap-2 rounded-md border">
            <Languages className="h-4 w-4" />
            <span className="hidden md:inline">en</span>
          </Button>
        </div>

        {/* Right Side */}
        <div className="right flex flex-wrap items-center gap-2">
          {/* Timer */}
          <Button className="bg-primary-100 text-primary-500 hover:bg-primary-200 border-primary-200 flex items-center gap-2 border">
            <Timer className="h-4 w-4" />
            <span className="hidden md:inline">{formattedTime}</span>
          </Button>

          {/* Microphone Selector */}
          <div>
            <Select value={selectedMic || ""} onValueChange={setSelectedMic}>
              <SelectTrigger className="w-full border border-gray-300 px-3">
                <Mic className="h-4 w-4 text-gray-600" />
              </SelectTrigger>
              <SelectContent>
                {microphones.map((mic) => (
                  <SelectItem key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || "Unnamed Mic"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!sessionId ? (
            <Button
              onClick={handleStartClick}
              className="bg-green-600 hover:bg-green-800"
            >
              <Play className="h-4 w-4" />
              <span className="hidden md:inline">Start Dictating</span>
            </Button>
          ) : (
            <Button
              onClick={isRecording ? handleStopClick : handleResumeClick}
              className={`border ${isRecording
                  ? "bg-transparent text-red-600 hover:bg-red-600 hover:text-white"
                  : "bg-transparent text-gray-800 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <Play className="h-4 w-4" />
              <span className="hidden md:inline">
                {isRecording ? "Stop Dictating" : "Resume"}
              </span>
            </Button>
          )}


        </div>
      </div>
    </div>
  );
};

export default Header;
