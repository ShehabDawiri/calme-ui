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
  FiCloud,
} from "react-icons/fi";
import Select from "react-select";
import { processAudio } from "../../../api/gladiaAPI/audioTranscriber";

export default function RecordingModal() {
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState([]);
  const [micDevices, setMicDevices] = useState([]);
  const [selectedMic, setSelectedMic] = useState(null);
  const mediaRecorder = useRef(null);
  const fileInputRef = useRef(null);

  // For recording visualization – separate analyser
  const recordAnalyserRef = useRef(null);
  // For playback visualization – separate analyser and animation frame id
  const playAnalyserRef = useRef(null);
  const playAnimationRef = useRef(null);

  // General AudioContext ref (shared)
  const audioContextRef = useRef(null);

  // Playback states
  const audioPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Processing states
  const [errorMessage, setErrorMessage] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [processingStep, setProcessingStep] = useState(null);

  // Ref for canvas to draw waveform (we reuse the same canvas for both recording and playback)
  const canvasRef = useRef(null);
  const drawAnimationRef = useRef(null);

  // Setup AudioContext and mic devices
  useEffect(() => {
    (async () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
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
        console.error("Error enumerating devices:", e);
      }
    })();

    return () => {
      audioContextRef.current?.close();
      cancelAnimationFrame(drawAnimationRef.current);
      cancelAnimationFrame(playAnimationRef.current);
    };
  }, []);

  // Draw waveform using provided analyser (it clears the canvas and redraws each frame)
  const drawWaveform = (analyser) => {
    if (!analyser || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Get CSS variable values (fallback provided if needed)
    const computedStyle = getComputedStyle(document.documentElement);
    const color1 =
      computedStyle.getPropertyValue("--color-primary-400").trim() || "#3498db";
    const color2 =
      computedStyle.getPropertyValue("--color-primary-500").trim() || "#2980b9";

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    const draw = () => {
      drawAnimationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillStyle = "var(--background)";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const sliceWidth = canvasRef.current.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const y = (dataArray[i] / 128) * (canvasRef.current.height / 2);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
      ctx.stroke();
    };
    draw();
  };

  // Recording controls – the mic stream is only routed to its analyser (not to speakers)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMic,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      // Create a media stream source and a dedicated analyser for recording visualization.
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const recordAnalyser = audioContextRef.current.createAnalyser();
      recordAnalyser.fftSize = 512;
      source.connect(recordAnalyser);
      recordAnalyserRef.current = recordAnalyser;

      // Start drawing waveform from the recording analyser.
      cancelAnimationFrame(drawAnimationRef.current);
      drawWaveform(recordAnalyser);

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) =>
        setAudioChunks((p) => [...p, e.data]);
      mediaRecorder.current.start();

      setIsRecording(true);
      setElapsedTime(0);
      setAudioChunks([]);
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert(
        "Microphone access denied. Please allow microphone access and try again.",
      );
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    setIsPaused(false);
    cancelAnimationFrame(drawAnimationRef.current);
    if (recordAnalyserRef.current) {
      recordAnalyserRef.current.disconnect &&
        recordAnalyserRef.current.disconnect();
      recordAnalyserRef.current = null;
    }
  };

  // Timer for recording
  useEffect(() => {
    let timer;
    if (isRecording && !isPaused) {
      timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
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
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlaying(false);
      setPlaybackProgress(0);
    }
  };

  // Playback controls – create a separate analyser for playback that connects to destination.
  const handlePlay = () => {
    if (!audioChunks.length) return;
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    setIsPlaying(true);

    const playbackAnalyser = audioContextRef.current.createAnalyser();
    playbackAnalyser.fftSize = 512;
    const playSource = audioContextRef.current.createMediaElementSource(audio);
    playSource.connect(playbackAnalyser);
    playbackAnalyser.connect(audioContextRef.current.destination);
    playAnalyserRef.current = playbackAnalyser;

    cancelAnimationFrame(drawAnimationRef.current);
    drawWaveform(playbackAnalyser);

    audio.play();
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      cancelAnimationFrame(drawAnimationRef.current);
    });
    audio.addEventListener("timeupdate", () => {
      setPlaybackProgress(audio.currentTime);
    });
  };

  const handlePause = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  // Save processing result as JSON.
  const handleSaveJson = () => {
    const result = { transcript, processingStep, errorMessage };
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.json";
    a.click();
  };

  // Format time as MM:SS.
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

  // Render processing as a list.
  const renderProcessing = () => (
    <AnimatePresence>
      {(processingStep || errorMessage || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-8 flex h-1/2 flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg"
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Processing Status
              </h3>
              <FiCloud className="text-xl text-[var(--color-primary-400)]" />
            </div>

            {/* Scrollable content container */}
            <div className="scrollbar-thin scrollbar-track-[var(--background)] scrollbar-thumb-[var(--color-primary-300)] max-h-64 overflow-y-auto pr-4">
              <ul className="list-inside list-disc space-y-3">
                {errorMessage && (
                  <li className="flex items-center rounded-lg bg-[var(--color-error-bg)] p-3 text-[var(--color-error)]">
                    <FiAlertCircle className="mr-2" />
                    <span className="flex-1">{errorMessage}</span>
                  </li>
                )}

                {processingStep && !errorMessage && (
                  <div className="flex items-center rounded-lg bg-[var(--color-primary-bg)] p-3 text-[var(--color-primary-400)]">
                    {processingStep !== "Upload complete" && (
                      <FiRefreshCcw className="mr-2 animate-spin" />
                    )}
                    <span className="flex-1 font-medium">{processingStep}</span>
                  </div>
                )}

                {transcript && (
                  <div className="rounded-lg bg-[var(--background)] p-4">
                    <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                      Transcript
                    </h3>
                    <p className="rounded bg-[var(--background)] p-3 whitespace-pre-wrap text-[var(--muted-foreground)]">
                      {transcript}
                    </p>
                  </div>
                )}
              </ul>
            </div>
          </div>

          {/* Save button section */}
          {transcript && (
            <div className="border-t border-[var(--border)] bg-[var(--background-secondary)] p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveJson}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-success)] px-6 py-3 text-white shadow-md transition-all hover:bg-[var(--color-success-hover)] hover:shadow-lg"
              >
                <FiSave className="text-lg" />
                <span className="font-semibold">Export Results as JSON</span>
              </motion.button>
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
              whileTap={{ scale: 1 }}
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
            whileTap={{ scale: 1 }}
            onClick={startRecording}
            className="rounded-full bg-[var(--color-primary-400)] p-4 text-white shadow-lg hover:bg-[var(--color-primary-500)]"
          >
            <FiMic size={24} />
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={() => setIsPaused(!isPaused)}
              className="rounded-full bg-[var(--color-warning)] p-3 text-white shadow-md"
            >
              {isPaused ? <FiPlay size={20} /> : <FiPause size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
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
              whileTap={{ scale: 1 }}
              onClick={handleSave}
              className="rounded-full bg-[var(--color-success)] p-3 text-white shadow-md hover:bg-[var(--color-success-hover)]"
            >
              <FiSave size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={handleDelete}
              className="rounded-full bg-[var(--color-neutral)] p-3 text-white shadow-md hover:bg-[var(--color-neutral-hover)]"
            >
              <FiTrash2 size={20} />
            </motion.button>

            {/* Playback controls */}
            {!audioPlayerRef.current ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1 }}
                onClick={handlePlay}
                className="rounded-full bg-[var(--color-secondary)] p-3 text-white shadow-md hover:bg-[var(--color-secondary-hover)]"
              >
                <FiPlay size={20} />
              </motion.button>
            ) : (
              <>
                {isPlaying ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 1 }}
                    onClick={handlePause}
                    className="rounded-full bg-[var(--color-warning)] p-3 text-white shadow-md hover:bg-[var(--color-warning-hover)]"
                  >
                    <FiPause size={20} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 1 }}
                    onClick={handleResume}
                    className="rounded-full bg-[var(--color-secondary)] p-3 text-white shadow-md hover:bg-[var(--color-secondary-hover)]"
                  >
                    <FiPlay size={20} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1 }}
                  onClick={handleReplay}
                  className="rounded-full bg-[var(--color-accent)] p-3 text-white shadow-md hover:bg-[var(--color-accent-hover)]"
                >
                  <FiSquare size={20} />
                </motion.button>
              </>
            )}

            {/* Processing button with new icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={handleSendToProcessing}
              className="rounded-full bg-[var(--color-accent)] p-3 text-white shadow-md hover:bg-[var(--color-accent-hover)]"
              title="Process Audio"
            >
              <FiCloud size={20} />
            </motion.button>

            {/* Save JSON button (visible when a transcript exists) */}
            {transcript && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1 }}
                onClick={handleSaveJson}
                className="rounded-full bg-[var(--color-primary)] p-3 text-white shadow-md hover:bg-[var(--color-primary-hover)]"
                title="Save as JSON"
              >
                <FiSave size={20} />
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Playback timeline */}
      {audioPlayerRef.current && (
        <div className="mb-8 text-center">
          <input
            type="range"
            min="0"
            max={audioPlayerRef.current.duration || 0}
            value={playbackProgress}
            onChange={(e) => {
              if (audioPlayerRef.current) {
                audioPlayerRef.current.currentTime = e.target.value;
                setPlaybackProgress(e.target.value);
              }
            }}
            className="w-full"
          />
          <div className="mt-2 text-sm text-[var(--muted-foreground)]">
            {formatTime(playbackProgress)} /{" "}
            {formatTime(audioPlayerRef.current.duration || 0)}
          </div>
        </div>
      )}

      {/* Processing status rendered as a list */}

      {renderProcessing()}

      {/* Status display */}
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
    </div>
  );
}
