import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
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
import { processAudio } from "../api/gladiaAPI/audioTranscriber";
import { useThemeContext } from "../context/ThemeContext";

const RecordingPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth0();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [micDevices, setMicDevices] = useState<any[]>([]);
  const [selectedMic, setSelectedMic] = useState<any>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const { isDarkMode } = useThemeContext();
  // Initialize audio context and devices
  useEffect(() => {
    const setupAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;

        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((device) => device.kind === "audioinput");
        setMicDevices(
          mics.map((mic, index) => ({
            value: mic.deviceId,
            label: mic.label || `Mic ${index + 1}`,
          }))
        );
        setSelectedMic(mics[0]?.deviceId || null);
      } catch (error) {
        console.error("Audio setup error:", error);
      }
    };

    setupAudio();

    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Waveform animation
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, isDarkMode ? "#3B82F6" : "#2563EB");
    gradient.addColorStop(0.5, isDarkMode ? "#2563EB" : "#1D4ED8");
    gradient.addColorStop(1, isDarkMode ? "#1D4ED8" : "#1E40AF");

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current?.getByteFrequencyData(dataArray);

      ctx.fillStyle = isDarkMode ? "#1F2937" : "#F9FAFB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128;
        const y = (v * canvas.height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  // Recording control functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMic,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      if (audioContextRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current!);
      }

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setElapsedTime(0);
      setAudioChunks([]);
      drawWaveform();
    } catch (err) {
      alert(t("record.micAccessError"));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  // File upload handler
  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudioChunks([event.target.files[0]]);
      setElapsedTime(0);
    }
  };

  // Action handlers
  const handleSave = () => {
    if (audioChunks.length === 0) return;
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
    if (audioChunks.length === 0) return;
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  };

  const handleSendToProcessing = async () => {
    if (audioChunks.length === 0) return;
    const blob = new Blob(audioChunks, { type: "audio/webm" });

    try {
      setProcessingStep(t("audioRecorder.errors.uploading"));
      setErrorMessage(null);
      setTranscript(null);

      const transcript = await processAudio(blob, handleProcessingUpdate, t);
      console.log("Transcript:", transcript);

      setProcessingStep(t("audioRecorder.errors.uploadComplete"));
      setTranscript(transcript);
    } catch (error: any) {
      console.error("Error during processing:", error);
      setErrorMessage(error.message || t("audioRecorder.errors.generalError"));
      setProcessingStep(null);
    }
  };

  const refreshMics = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter((device) => device.kind === "audioinput");
      setMicDevices(
        mics.map((mic, index) => ({
          value: mic.deviceId,
          label: mic.label || `Mic ${index + 1}`,
        }))
      );
      setSelectedMic(mics[0]?.deviceId || null);
    } catch (error) {
      console.error("Error refreshing mics:", error);
    }
  };

  const handleProcessingUpdate = (message: string) => {
    setProcessingStep(message);
  };

  const renderProcessingFeedback = () => (
    <AnimatePresence>
      {(processingStep || errorMessage || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          {errorMessage && (
            <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
              <FiAlertCircle className="mr-2" />
              <span>{errorMessage}</span>
            </div>
          )}

          {processingStep && !errorMessage && (
            <div className="flex items-center text-blue-600 dark:text-blue-400 mb-4">
              <FiRefreshCcw className="mr-2 animate-spin" />
              <span>{processingStep}</span>
            </div>
          )}

          {transcript && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                {t("audioRecorder.transcript")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
              {t("record.welcome")}, {user?.name || t("record.user")} 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("record.recordingInstructions")}
            </p>
          </div>

          {/* Microphone Selection */}
          <div className="mb-10 flex items-center justify-center space-x-4">
            <FiMic className="text-3xl text-blue-600 dark:text-blue-400" />
            <Select
              className="w-72"
              options={micDevices}
              value={micDevices.find((mic) => mic.value === selectedMic)}
              onChange={(option) => setSelectedMic(option?.value)}
              placeholder={t("record.selectMic")}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: isDarkMode ? "#1F2937" : "white",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: isDarkMode ? "#64748b" : "#94A3B8",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: isDarkMode ? "#1F2937" : "white",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused
                    ? isDarkMode
                      ? "#4B5563"
                      : "#BFDBFE"
                    : "transparent",
                }),
              }}
            />
            <button
              onClick={refreshMics}
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={t("record.refreshMics")}
            >
              <FiRefreshCcw className="text-gray-600 dark:text-gray-300 text-xl" />
            </button>
          </div>

          {/* Waveform Visualization */}
          <div className="mb-10">
            <canvas
              ref={canvasRef}
              className="w-full h-48 rounded-3xl shadow-inner border border-gray-200 dark:border-gray-700"
              width="1400"
              height="200"
            />
          </div>

          {/* Timer */}
          <div className="text-center mb-14">
            <div className="text-7xl font-mono text-gray-800 dark:text-white tracking-tighter">
              {Math.floor(elapsedTime / 60)
                .toString()
                .padStart(2, "0")}
              :{(elapsedTime % 60).toString().padStart(2, "0")}
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {!isRecording && audioChunks.length === 0 && (
              <>
                {/* Upload Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-10 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title={t("record.uploadAudio")}
                >
                  <FiUpload className="text-4xl" />
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
                className="p-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                title={t("record.startRecording")}
              >
                <FiMic className="text-4xl" />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title={isPaused ? t("record.resume") : t("record.pause")}
                >
                  {isPaused ? (
                    <FiPlay className="text-3xl" />
                  ) : (
                    <FiPause className="text-3xl" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                  className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title={t("record.stopRecording")}
                >
                  <FiSquare className="text-3xl" />
                </motion.button>
              </>
            )}

            {audioChunks.length > 0 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title={t("record.saveRecording")}
                >
                  <FiSave className="text-3xl" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="p-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title={t("record.deleteRecording")}
                >
                  <FiTrash2 className="text-3xl" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlay}
                  className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title={t("record.playRecording")}
                >
                  <FiPlay className="text-3xl" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendToProcessing}
                  className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title={t("record.processRecording")}
                >
                  <FiSettings className="text-3xl" />
                </motion.button>
              </>
            )}
          </div>

          {/* Status Indicator */}
          <div className="text-center text-gray-600 dark:text-gray-400">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.span
                  key="recording"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <FiAlertCircle className="text-red-500 animate-pulse text-2xl" />
                  <span className="text-lg font-medium">
                    {isPaused ? t("record.paused") : t("record.recording")}
                  </span>
                </motion.span>
              ) : audioChunks.length > 0 ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <FiCheckCircle className="text-green-500 text-2xl" />
                  <span className="text-lg font-medium">
                    {t("record.recordingSaved")}
                  </span>
                </motion.span>
              ) : (
                <motion.span
                  key="ready"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <FiMic className="text-blue-500 text-2xl" />
                  <span className="text-lg font-medium">
                    {t("record.readyToRecord")}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {renderProcessingFeedback()}
        </motion.div>
      </div>
    </div>
  );
};

export default RecordingPage;
