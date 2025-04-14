import React from "react";
import { useRecordStore } from "@/hooks/useRecordingStore";

const ContextPage = () => {
  const { status, result } = useRecordStore();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Status: {status}</h2>
      {status === "completed" && result ? (
        <div className="mt-4">
          <h3 className="text-xl font-medium">Transcription Result:</h3>
          <p className="mt-2">{result}</p>
        </div>
      ) : (
        <div className="mt-4">
          {status === "processing" && <p>Processing the audio...</p>}
          {status === "error" && (
            <p className="text-red-600">
              An error occurred during transcription.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContextPage;
