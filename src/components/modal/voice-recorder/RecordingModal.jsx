import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiSave,
  FiTrash2,
  FiPause,
  FiPlay,
  FiSquare,
  FiSettings,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCcw,
  FiUpload,
} from "react-icons/fi";
import Select from "react-select";
import { processAudio } from "../../../api/gladiaAPI/audioTranscriber";

export default function RecordingModal() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState([]);
  const [micDevices, setMicDevices] = useState([]);
  const [selectedMic, setSelectedMic] = useState(null);
  const mediaRecorder = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const fileInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [processingStep, setProcessingStep] = useState(null);

  // Audio setup
  useEffect(() => {
    (async () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          window.AudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;

        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((d) => d.kind === "audioinput");
        setMicDevices(
          mics.map((mic, i) => ({
            value: mic.deviceId,
            label: mic.label || `Mic ${i + 1}`,
          })),
        );
        setSelectedMic(mics[0]?.deviceId || null);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => audioContextRef.current?.close();
  }, []);

  // Visualizer
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    gradient.addColorStop(0, "var(--color-primary-400)");
    gradient.addColorStop(1, "var(--color-primary-500)");

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = "var(--background)";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const sliceWidth = canvasRef.current.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const y = (dataArray[i] / 128) * (canvasRef.current.height / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
      ctx.stroke();
    };
    draw();
  };

  // Recording controls
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMic,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) =>
        setAudioChunks((p) => [...p, e.data]);
      mediaRecorder.current.start();
      setIsRecording(true);
      setElapsedTime(0);
      setAudioChunks([]);
      drawWaveform();
    } catch {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    setIsPaused(false);
    cancelAnimationFrame(animationRef.current);
  };

  // Timer
  useEffect(() => {
    let iv;
    if (isRecording && !isPaused) {
      iv = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(iv);
  }, [isRecording, isPaused]);

  // File handling
  const handleUploadFile = (e) => {
    if (e.target.files[0]) {
      setAudioChunks([e.target.files[0]]);
      setElapsedTime(0);
    }
  };

  // Audio actions
  const handleSave = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
  };

  const handleDelete = () => {
    setAudioChunks([]);
    setElapsedTime(0);
  };

  const handlePlay = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    new Audio(URL.createObjectURL(blob)).play();
  };

  const handleSendToProcessing = async () => {
    if (!audioChunks.length) return;
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    try {
      setProcessingStep("Uploading...");
      setErrorMessage(null);
      setTranscript(null);
      const text = await processAudio(blob, setProcessingStep);
      setProcessingStep("Upload complete");
      setTranscript(text);
    } catch (e) {
      setErrorMessage(e.message || "An error occurred.");
      setProcessingStep(null);
    }
  };

  const refreshMics = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter((d) => d.kind === "audioinput");
    setMicDevices(
      mics.map((mic, i) => ({
        value: mic.deviceId,
        label: mic.label || `Mic ${i + 1}`,
      })),
    );
    setSelectedMic(mics[0]?.deviceId || null);
  };

  const renderProcessing = () => (
    <AnimatePresence>
      {(processingStep || errorMessage || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg"
        >
          {errorMessage && (
            <div className="mb-4 flex items-center text-[var(--color-error)]">
              <FiAlertCircle className="mr-2" /> {errorMessage}
            </div>
          )}
          {processingStep && !errorMessage && (
            <div className="mb-4 flex items-center text-[var(--color-primary-400)]">
              <FiRefreshCcw className="mr-2 animate-spin" /> {processingStep}
            </div>
          )}
          {transcript && (
            <div className="mt-4">
              <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                Transcript
              </h3>
              <p className="whitespace-pre-wrap text-[var(--muted-foreground)]">
                {transcript}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-[var(--background)] p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <p className="text-xl text-[var(--muted-foreground)]">
          Click the mic to start recording, or upload an audio file.
        </p>
      </motion.div>

      {/* Mic selection */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <FiMic className="text-2xl text-[var(--color-primary-400)]" />
        <Select
          className="w-64"
          options={micDevices}
          value={micDevices.find((m) => m.value === selectedMic)}
          onChange={(o) => setSelectedMic(o.value)}
          placeholder="Select microphone"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              boxShadow: "none",
              "&:hover": { borderColor: "var(--color-primary-300)" },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused
                ? "var(--color-primary-100)"
                : "transparent",
              color: "var(--foreground)",
              "&:active": { backgroundColor: "var(--color-primary-200)" },
            }),
            singleValue: (base) => ({
              ...base,
              color: "var(--foreground)",
            }),
          }}
        />
        <button
          onClick={refreshMics}
          className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--color-primary-400)]"
          title="Refresh microphones"
        >
          <FiRefreshCcw className="text-xl" />
        </button>
      </div>

      {/* Visualizer */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="mb-6 overflow-hidden rounded-xl border border-[var(--border)] shadow-sm"
      >
        <canvas
          ref={canvasRef}
          className="h-32 w-full"
          width="800"
          height="200"
        />
      </motion.div>

      {/* Timer */}
      <div className="mb-8 text-center font-mono text-4xl text-[var(--color-primary-500)]">
        {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:
        {String(elapsedTime % 60).padStart(2, "0")}
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {!isRecording && !audioChunks.length && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current.click()}
              className="rounded-full bg-[var(--color-success)] p-4 text-white shadow-lg hover:bg-[var(--color-success-hover)]"
            >
              <FiUpload size={24} />
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleUploadFile}
              className="hidden"
            />
          </>
        )}

        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="rounded-full bg-[var(--color-primary-400)] p-4 text-white shadow-lg hover:bg-[var(--color-primary-500)]"
          >
            <FiMic size={24} />
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPaused(!isPaused)}
              className="rounded-full bg-[var(--color-warning)] p-3 text-white shadow-md"
            >
              {isPaused ? <FiPlay size={20} /> : <FiPause size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="rounded-full bg-[var(--color-error)] p-3 text-white shadow-md"
            >
              <FiSquare size={20} />
            </motion.button>
          </>
        )}

        {!!audioChunks.length && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="rounded-full bg-[var(--color-success)] p-3 text-white shadow-md hover:bg-[var(--color-success-hover)]"
            >
              <FiSave size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="rounded-full bg-[var(--color-neutral)] p-3 text-white shadow-md hover:bg-[var(--color-neutral-hover)]"
            >
              <FiTrash2 size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              className="rounded-full bg-[var(--color-secondary)] p-3 text-white shadow-md hover:bg-[var(--color-secondary-hover)]"
            >
              <FiPlay size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendToProcessing}
              className="rounded-full bg-[var(--color-accent)] p-3 text-white shadow-md hover:bg-[var(--color-accent-hover)]"
            >
              <FiSettings size={20} />
            </motion.button>
          </>
        )}
      </div>

      {/* Status */}
      <div className="mb-4 text-center text-[var(--muted-foreground)]">
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="rec"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <FiAlertCircle className="animate-pulse text-[var(--color-error)]" />
              <span>{isPaused ? "Paused" : "Recording"}</span>
            </motion.div>
          ) : audioChunks.length ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <FiCheckCircle className="text-[var(--color-success)]" />
              <span>Recording saved</span>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <FiMic className="text-[var(--color-primary-400)]" />
              <span>Ready to record</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {renderProcessing()}
    </div>
  );
}
