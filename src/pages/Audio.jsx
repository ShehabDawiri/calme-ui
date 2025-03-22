import React, { useState, useEffect } from "react";

const AudioTranscriber = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  let recognition;

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(finalTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      alert("Speech Recognition is not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Audio Transcript</h2>
      <div className="mb-4">
        <button
          onClick={startListening}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Start
        </button>
        <button
          onClick={stopListening}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
      </div>
      <iframe
        title="Transcript"
        className="w-full h-64 border p-2"
        srcDoc={`<html><body style="font-size:16px;padding:10px;">${transcript}</body></html>`}
      />
    </div>
  );
};

export default AudioTranscriber;
