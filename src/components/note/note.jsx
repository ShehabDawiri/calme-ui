import React from "react";
import { useRecordStore } from "@/hooks/useRecordingStore";

const NotePage = () => {
  const { status, result } = useRecordStore();

  return (
    <div className="p-4">
      {status === "completed" && result ? (
        <p className="whitespace-pre-line text-gray-800">{result}</p>
      ) : status === "processing" ? (
        <p className="italic text-gray-500">Processing...</p>
      ) : status === "error" ? (
        <p className="text-red-600">An error occurred during transcription.</p>
      ) : (
        <p className="text-gray-400 italic">No note yet.</p>
      )}
    </div>
  );
};

export default NotePage;
