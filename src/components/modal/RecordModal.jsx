import { useState, useEffect, useRef } from "react";
import { useModalStore } from "@/hooks/modalStore";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSession } from "@/hooks/useSession";
import { useRecordStore } from "@/hooks/useRecordingStore";
import { processAudio } from "@/api/gladiaApi/audioTranscriber";
import { v4 as uuidv4 } from "uuid";

export default function RecordModal() {
  const { isRecordModalOpen, closeRecordModal } = useModalStore();
  const { setSelectedSession } = useSession();
  const [mode, setMode] = useState("transcribe");
  const [language, setLanguage] = useState("en");
  const [microphones, setMicrophones] = useState([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const fileInputRef = useRef(null);

  const { isRecording, startRecording, stopRecording, setLang } =
    useRecordStore();

  const languageMap = { 
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "nl": "Dutch",
    "hi": "Hindi",
    "ja": "Japanese",
    "zh": "Chinese",
    "ru": "Russian",
    "ar": "Arabic"
  };

  useEffect(() => {
    const getMicrophones = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setMicrophones(audioDevices);
        if (audioDevices.length > 0) {
          setSelectedMicrophone(audioDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing microphones:", error);
      }
    };

    if (isRecordModalOpen && mode === "transcribe") {
      getMicrophones();
    }
  }, [isRecordModalOpen, mode]);

  const refreshMicrophones = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      setMicrophones(audioDevices);
    } catch (error) {
      console.error("Error refreshing microphones:", error);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  // Function to save complete Gladia response to MongoDB
  const saveTranscriptToDatabase = async (gladiaResponse, sessionId) => {
  try {
    console.log("sessionId +=>",sessionId);
    const response = await fetch('http://127.0.0.1:5000/api/transcript/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        therapist_id: "1",
        user_id: "2",
        gladia_response: gladiaResponse,
        language: language
      }),
    });

      if (!response.ok) {
        throw new Error('Failed to save transcript');
      }

      const result = await response.json();
      console.log('Transcript saved:', result);
      return result;
    } catch (error) {
      console.error('Error saving transcript:', error);
      throw error;
    }
  };

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    setLoading(true);
    setTranscript("");
    const sessionId = uuidv4();
    setSelectedSession(sessionId); // Store session in frontend state

    try {
      const gladiaResponse = await processAudio(
        file,
        { language },
        (step) => console.log(step)
      );

      let transcriptText = "";
      if (gladiaResponse?.result?.transcription?.full_transcript) {
        transcriptText = gladiaResponse.result.transcription.full_transcript;
      } else if (typeof gladiaResponse === 'string') {
        transcriptText = gladiaResponse;
      }

      setTranscript(transcriptText);
      await saveTranscriptToDatabase(gladiaResponse, sessionId); // <-- pass it
    } catch (error) {
      console.error("Error processing file:", error.message);
      setTranscript(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
};


  const handleStartSession = async () => {
    if (isRecording) {
      const recordingData = await stopRecording();
      if (recordingData) {
        // Save the full recording data to MongoDB
        try {
          await saveTranscriptToDatabase(recordingData);
        } catch (error) {
          console.error("Error saving transcript:", error);
        }
      }
    } else {
      setLang(language);
      const newSessionId = uuidv4();
      setSelectedSession(newSessionId);
      startRecording();
    }
    closeRecordModal();
  };

  return (
    <Modal
      isOpen={isRecordModalOpen}
      onClose={closeRecordModal}
      title={mode === "transcribe" ? "Recording Modal" : "Dictation Modal"}
      description={
        mode === "transcribe"
          ? "Choose transcription options and start recording"
          : "Upload a file for dictation"
      }
    >
      {/* Mode toggle */}
      <div className="mb-6 flex justify-center gap-2">
        <Button
          variant={mode === "transcribe" ? "default" : "outline"}
          onClick={() => setMode("transcribe")}
        >
          Dictate
        </Button>
        <Button
          variant={mode === "dictate" ? "default" : "outline"}
          onClick={() => setMode("dictate")}
        >
          Transcribe
        </Button>
      </div>

      {/* Language select */}
      <div className="mb-4 text-center text-base font-medium text-gray-700">
        {mode === "transcribe" ? "Dictating" : "Transcribing"} in{' '}
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="inline-flex w-fit">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(languageMap).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {mode === "transcribe" ? (
        // Transcribe UI
        <>
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium">Select Microphone</h3>
            <div className="flex items-center gap-2">
              <Select
                value={selectedMicrophone}
                onValueChange={setSelectedMicrophone}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent>
                  {microphones.map((mic) => (
                    <SelectItem key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microphone ${mic.deviceId.slice(0, 5)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={refreshMicrophones}>
                Refresh
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Dictation/upload UI
        <>
          <h1 className="mb-4 text-center text-xl font-semibold">
            Upload your audio/video file and we'll convert it to text
          </h1>

          <div className="mb-6 flex flex-col items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="audio/*,video/*"
            />
            <Button variant="outline" onClick={handleFileUpload}>
              Choose File
            </Button>
            <p className="text-xs text-gray-500">
              Supported formats: MP3, WAV, MP4, MOV, etc.
            </p>
          </div>

          {/* Display loading or transcript */}
          {loading ? (
            <p className="text-center">Processing...</p>
          ) : transcript ? (
            <div className="p-4 bg-gray-100 rounded-lg max-h-60 overflow-auto">
              <pre className="whitespace-pre-wrap">{transcript}</pre>
            </div>
          ) : null}
        </>
      )}

      {/* Primary action for recording */}
      {mode === "transcribe" && (
        <Button
          className="mt-6 w-full"
          onClick={handleStartSession}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      )}

      {/* Alternative action */}
      <div className="mt-4 text-center text-sm">
        Or{' '}
        <button
          onClick={() =>
            setMode(mode === "transcribe" ? "dictate" : "transcribe")
          }
          className="cursor-pointer text-blue-600 underline"
        >
          {mode === "transcribe"
            ? "upload a file to dictate"
            : "use live transcription"}
        </button>
      </div>
    </Modal>
  );
}