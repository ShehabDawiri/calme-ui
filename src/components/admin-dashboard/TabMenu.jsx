import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Mic, MessageCircle, NotebookPen, ChartBar } from "lucide-react";
import TimelinePage from "@/pages/test";
import { useSession } from "@/hooks/useSession";
import ContextPage from "@/components/context/context";
import Team1Main from "../analysis/Team1main";
import TranscriptPage from "../transcript/transcript";

const TabMenu = () => {
  // Fetch the session ID from the global state using the useSession hook
  // This ID is used to fetch session data and manage the current session
  const sessionId = useSession((state) => state.sessionId);

  return (
    <div className="h-full w-full overflow-hidden">
      <Tabs defaultValue="transcript" className="h-full w-full">
        <TabsList className="flex h-fit w-full items-center justify-baseline rounded-none bg-transparent py-3">
          <div className="text-primary-500 flex h-full w-fit items-center justify-center gap-3">
            <TabsTrigger value="transcript" className={"bg-primary-100"}>
              <Mic size={16} /> Transcript
            </TabsTrigger>
            <TabsTrigger value="context" className={"bg-primary-100"}>
              <MessageCircle size={16} /> Context
            </TabsTrigger>
            <TabsTrigger value="note" className={"bg-primary-100"}>
              <NotebookPen size={16} /> Note
            </TabsTrigger>
            <TabsTrigger value="analysis" className={"bg-primary-100"}>
              <ChartBar size={16} /> Analysis
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent
          value="transcript"
          className="h-full w-full overflow-scroll"
        >
        <TranscriptPage />
        </TabsContent>
        <TabsContent value="context">

          <ContextPage />
        </TabsContent>
        <TabsContent value="note"></TabsContent>
        <TabsContent value="analysis" 
                     className="h-full w-full overflow-scroll">
          <Team1Main />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabMenu;
