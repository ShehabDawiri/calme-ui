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
  audioBlob: null, // <-- store the recorded audio blob for playback

  setLang: (lang) => set({ lang }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result }),

  startRecording: async (deviceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        clearInterval(get().intervalId);

        const blob = new Blob(chunks, { type: "audio/webm" });

        // Save the blob for playback
        set({ audioBlob: blob });

        // Validate audio size
        if (blob.size < 1024) {
          set({
            isProcessing: false,
            status: "error: Audio file is too small or empty",
            result: null,
          });
          return;
        }

        set({ isProcessing: true, status: "processing" });

        try {
          const response = await processAudio(
            blob,
            { language: get().lang },
            (step) => set({ status: step })
          );

          const transcript =
            response?.result?.transcription?.full_transcript ||
            response?.transcript ||
            response;

          if (!transcript) {
            throw new Error("No transcript found in API response");
          }

          set({
            result: transcript,
            isProcessing: false,
            status: "completed",
          });
        } catch (error) {
          console.error("Processing error:", error);
          set({
            isProcessing: false,
            status: `error: ${error.message.replace("Error: ", "")}`,
            result: null,
          });
        }
      };

      mediaRecorder.start();

      const intervalId = setInterval(() => {
        set((state) => ({ timer: state.timer + 1 }));
      }, 1000);

      set({
        isRecording: true,
        stream,
        mediaRecorder,
        intervalId,
        timer: 0,
        status: "recording",
        result: null,
        audioBlob: null, // clear previous audioBlob on new recording
      });
    } catch (err) {
      console.error("Error starting recording:", err);
      set({ status: "error", isRecording: false });
    }
  },

  stopRecording: () => {
    const { mediaRecorder, stream, intervalId } = get();

    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop();
    }

    stream?.getTracks().forEach((track) => track.stop());
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
      audioBlob: null,
    });
  },

  processAndStoreAudio: async (blob) => {
    try {
      set({ isProcessing: true, status: "processing" });
      const result = await processAudio(
        blob,
        { language: get().lang },
        (step) => set({ status: step })
      );
      set({ result, isProcessing: false, status: "stored" });
      return result;
    } catch (error) {
      set({
        isProcessing: false,
        status: `error: ${error.message}`,
        result: null,
      });
      throw error;
    }
  },
}));
