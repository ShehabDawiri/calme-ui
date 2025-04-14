import { create } from "zustand";
import { processAudio } from "@/api/gladiaAPI/audioTranscriber";
import { useState, useEffect, useRef } from "react";

// function TimerControl() {
//   const [count, setCount] = useState(0);
//   const intervalRef = useRef(null); // store interval ID

//   const start = () => {
//     if (!intervalRef.current) {
//       intervalRef.current = setInterval(() => {
//         setCount((prev) => prev + 1);
//       }, 1000);
//     }
//   };

//   const stop = () => {
//     clearInterval(intervalRef.current);
//     intervalRef.current = null;
//   };

//   useEffect(() => {
//     return () => stop(); // cleanup on unmount
//   }, []);

//   return {
//     stopTimer: stop ,
//     startTimer: start, 
//     time: count
//   };
// }

export const useRecordStore = create((set, get) => ({
  isRecording: false,
  isProcessing: false,
  status: "idle",
  result: null,
  lang: "en",
  timer: 0,
  stream: null,
  mediaRecorder: null,
  intervalId: null,
  timerInterval: null,

  setLang: (lang) => set({ lang }),

  startRecording: async (deviceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId },
      });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      const timerInterval = setInterval(() => {
        const currentTimer = get().timer;
        set({ timer: currentTimer + 1 });
        console.log("one second passed");
      }, 1000);

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        console.log("Audio blob:", blob);

        set({ isProcessing: true, status: "processing"});
        
        try {
          clearInterval(get().timerInterval);
          const transcript = await processAudio(
            blob,
            { language: lang },
            (step) => {
              set({ status: step });
            },
          );

          set({
            result: transcript,
            isProcessing: false,
            status: "completed",
          });
        } catch (error) {
          set({
            isProcessing: false,
            status: `error: ${error.message}`,
            result: null,
          });
        }
      };
      mediaRecorder.start();
      
      
      const intervalId = setInterval(() => {
        set((state) => {
          if (state.status !== step) {
            return { status: step };
          }
          return state;
        });
      }, 1000);

      set({
        isRecording: true,
        stream,
        mediaRecorder,
        intervalId,
        timer: 0,
        status: "recording",
        result: null,
      });
    } catch (err) {
      console.error("Error starting recording:", err);
      set({ status: "error" });
    }
  },

  stopRecording: () => {
    const { mediaRecorder, stream, intervalId , timerInterval} = get();

    if (mediaRecorder) mediaRecorder.stop();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(intervalId);
    // clearInterval(timerInterval);

    set({
      isRecording: false,
      stream: null,
      mediaRecorder: null,
      intervalId: null,
      status: "stopping",
    });
  },

  resetRecording: () => {
    set({
      isRecording: false,
      isProcessing: false,
      status: "idle",
      result: null,
      timer: 0,
      stream: null,
      mediaRecorder: null,
      intervalId: null,
      timerInterval: null,
    });
  },
}));
