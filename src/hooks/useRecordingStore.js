import { create } from "zustand";

export const useRecordStore = create((set, get) => ({
  isRecording: false,
  timer: 0,
  stream: null,
  mediaRecorder: null,
  intervalId: null,

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

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        console.log("Audio blob:", blob);
        // You can store or upload the blob here
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
      });
    } catch (err) {
      console.error("Error starting recording:", err);
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
    });
  },
}));
