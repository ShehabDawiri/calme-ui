import React, { useState, useEffect, useRef } from "react";
import { useRecordStore } from "@/hooks/useRecordingStore";

const NotePage = () => {
  const { status, result, audioBlob } = useRecordStore();
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAudioUrl(null);
    }
  }, [audioBlob]);

  // Event listeners to track play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.warn("Audio ref is null");
      return;
    }

    // Check if audio is ready
    if (audio.readyState < 2) {
      console.warn("Audio not ready to play");
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Play error:", error);
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {status === "completed" && result ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Transcript</h2>
          <p className="whitespace-pre-line rounded-lg bg-gray-50 p-4 text-gray-800">
            {result?.transcription?.full_transcript || result}
          </p>
        </div>
      ) : status === "processing" ? (
        <div className="text-gray-500">Processing audio...</div>
      ) : status?.startsWith("error") ? (
        <p className="text-red-600">{status}</p>
      ) : (
        <p className="text-gray-400 italic">No transcription available yet</p>
      )}

      {audioUrl && (
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isPlaying ? "Pause Audio" : "Play Audio"}
          </button>
          <audio ref={audioRef} src={audioUrl} preload="auto" />
        </div>
      )}
    </div>
  );
};

export default NotePage;
