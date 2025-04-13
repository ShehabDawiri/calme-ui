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
import { v4 as uuidv4 } from "uuid";

export default function RecordModal() {
  const { isRecordModalOpen, closeRecordModal } = useModalStore();
  const { setSelectedSession } = useSession();
  const [mode, setMode] = useState("transcribe");
  const [language, setLanguage] = useState("en");
  const [microphones, setMicrophones] = useState([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const fileInputRef = useRef(null);

  const { isRecording, startRecording, stopRecording, setLang } =
    useRecordStore();
  const languageMap = {
    af: "Afrikaans",
    sq: "Albanian",
    am: "Amharic",
    ar: "Arabic",
    hy: "Armenian",
    as: "Assamese",
    az: "Azerbaijani",
    ba: "Bashkir",
    eu: "Basque",
    be: "Belarusian",
    bn: "Bengali",
    bs: "Bosnian",
    br: "Breton",
    bg: "Bulgarian",
    ca: "Catalan",
    zh: "Chinese",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    nl: "Dutch",
    en: "English",
    et: "Estonian",
    fo: "Faroese",
    fi: "Finnish",
    fr: "French",
    gl: "Galician",
    ka: "Georgian",
    de: "German",
    el: "Greek",
    gu: "Gujarati",
    ht: "Haitian Creole",
    ha: "Hausa",
    haw: "Hawaiian",
    he: "Hebrew",
    hi: "Hindi",
    hu: "Hungarian",
    is: "Icelandic",
    id: "Indonesian",
    it: "Italian",
    ja: "Japanese",
    jv: "Javanese",
    kn: "Kannada",
    kk: "Kazakh",
    km: "Khmer",
    ko: "Korean",
    lo: "Lao",
    la: "Latin",
    lv: "Latvian",
    ln: "Lingala",
    lt: "Lithuanian",
    lb: "Luxembourgish",
    mk: "Macedonian",
    mg: "Malagasy",
    ms: "Malay",
    ml: "Malayalam",
    mt: "Maltese",
    mi: "Maori",
    mr: "Marathi",
    mn: "Mongolian",
    mymr: "Burmese",
    ne: "Nepali",
    no: "Norwegian",
    nn: "Norwegian Nynorsk",
    oc: "Occitan",
    ps: "Pashto",
    fa: "Persian",
    pl: "Polish",
    pt: "Portuguese",
    pa: "Punjabi",
    ro: "Romanian",
    ru: "Russian",
    sa: "Sanskrit",
    sr: "Serbian",
    sn: "Shona",
    sd: "Sindhi",
    si: "Sinhala",
    sk: "Slovak",
    sl: "Slovenian",
    so: "Somali",
    es: "Spanish",
    su: "Sundanese",
    sw: "Swahili",
    sv: "Swedish",
    tl: "Tagalog",
    tg: "Tajik",
    ta: "Tamil",
    tt: "Tatar",
    te: "Telugu",
    th: "Thai",
    bo: "Tibetan",
    tr: "Turkish",
    tk: "Turkmen",
    uk: "Ukrainian",
    ur: "Urdu",
    uz: "Uzbek",
    vi: "Vietnamese",
    cy: "Welsh",
    yi: "Yiddish",
    yo: "Yoruba",
    jp: "Japanese", // Note: 'jp' should technically be 'ja' for Japanese
  };

  useEffect(() => {
    const getMicrophones = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput",
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
        (device) => device.kind === "audioinput",
      );
      setMicrophones(audioDevices);
    } catch (error) {
      console.error("Error refreshing microphones:", error);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (mode === "dictate") {
        console.log("Processing file for dictation:", file);
      }
    }
  };
  const handleStartSession = () => {
    if (isRecording) {
      stopRecording();
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
      {/* Mode toggle buttons */}
      <div className="mb-6 flex justify-center gap-2">
        <Button
          variant={mode === "transcribe" ? "default" : "outline"}
          onClick={() => setMode("transcribe")}
        >
          Transcribe
        </Button>
        <Button
          variant={mode === "dictate" ? "default" : "outline"}
          onClick={() => setMode("dictate")}
        >
          Dictate
        </Button>
      </div>

      {/* Language selection */}
      <div className="mb-4 text-center text-base font-medium text-gray-700">
        {mode === "transcribe" ? "Transcribing" : "Dictating"} in{" "}
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

      {/* Mode-specific content */}
      {mode === "transcribe" ? (
        <>
          <h1 className="mb-4 text-center text-xl font-semibold">
            Set your microphone, hit record, and we'll generate a perfect note
          </h1>

          <Select
            value={selectedMicrophone}
            onValueChange={setSelectedMicrophone}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a microphone" />
            </SelectTrigger>
            <SelectContent>
              {microphones.map((microphone) => (
                <SelectItem
                  key={microphone.deviceId}
                  value={microphone.deviceId}
                >
                  {microphone.label ||
                    `Microphone ${microphone.deviceId.slice(0, 5)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="mt-3 text-center text-xs text-gray-500">
            System audio will also be transcribed to support telehealth sessions
            <br />
            Not seeing your devices?{" "}
            <button
              onClick={refreshMicrophones}
              className="cursor-pointer text-blue-600 underline"
            >
              Refresh here
            </button>
          </p>
        </>
      ) : (
        <>
          <h1 className="mb-4 text-center text-xl font-semibold">
            Upload your audio file and we'll convert it to text
          </h1>

          <div className="mb-6 flex flex-col items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="audio/*,video/*, .doc, .docx, .pdf"
            />
            <Button
              variant="outline"
              onClick={handleFileUpload}
              className="w-full"
            >
              Choose File
            </Button>
            <p className="text-xs text-gray-500">
              Supported formats: MP3, WAV, DOC, PDF, and more
            </p>
          </div>
        </>
      )}

      {/* Primary action */}
      <Button
        className="mt-6 w-full"
        onClick={mode === "transcribe" ? handleStartSession : handleFileUpload}
      >
        {mode === "transcribe"
          ? isRecording
            ? "Stop Recording"
            : "Start Recording"
          : "Upload File for Dictation"}
      </Button>

      {/* Alternative action */}
      <div className="mt-4 text-center text-sm">
        Or{" "}
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
