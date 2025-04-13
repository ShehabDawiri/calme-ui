import { create } from "zustand";
import { processAudio } from "@/api/gladiaAPI/audioTranscriber";

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

  setLang: (lang) => set({ lang }),

  startRecording: async (deviceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId },
      });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        console.log("Audio blob:", blob);

        set({ isProcessing: true, status: "processing" });

        try {
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
    const { mediaRecorder, stream, intervalId } = get();

    if (mediaRecorder) mediaRecorder.stop();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(intervalId);

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
    });
  },
}));
