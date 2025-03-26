// /src/api/gladiaApi/audioTranscriber.js

const API_UPLOAD_URL = "https://api.gladia.io/v2/upload";
const API_PRE_RECORDED_URL = "https://api.gladia.io/v2/pre-recorded";
const API_KEY = import.meta.env.VITE_GLADIA_API_KEY;

export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append("audio", file);

  const options = {
    method: "POST",
    headers: {
      "x-gladia-key": API_KEY,
    },
    body: formData,
  };

  const response = await fetch(API_UPLOAD_URL, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "File upload failed");
  }
  return data;
}

export async function startPreRecordedJob(audioUrl) {
  const payload = {
    audio_url: audioUrl,
    translation: false,
    detect_language: true,
    enable_code_switching: false,
  };

  const options = {
    method: "POST",
    headers: {
      "x-gladia-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(API_PRE_RECORDED_URL, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to start processing");
  }
  return data;
}

export async function getPreRecordedResult(jobId) {
  const options = {
    method: "GET",
    headers: {
      "x-gladia-key": API_KEY,
    },
  };

  const response = await fetch(`${API_PRE_RECORDED_URL}/${jobId}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to retrieve result");
  }
  return data;
}

/**
 * @param {Blob} file - Audio file to process
 * @param {Function} updateStepCallback - Function to update processing status
 * @param {Function} t - Translation function
 */
export async function processAudio(file, updateStepCallback, t) {
  try {
    updateStepCallback(t("audioRecorder.errors.uploading"));
    const uploadResponse = await uploadAudio(file);
    const audioUrl = uploadResponse.audio_url;
    console.log("Uploaded audio file:", uploadResponse);

    updateStepCallback(t("audioRecorder.status.startingProcessing"));
    const jobResponse = await startPreRecordedJob(audioUrl);
    console.log("Started processing job:", jobResponse);
    const jobId = jobResponse.id;

    let result = null;
    const pollingInterval = 5000;
    updateStepCallback(t("record.audioRecorder.status.processing"));

    while (true) {
      result = await getPreRecordedResult(jobId);
      console.log("Result:", result);
      if (result.status === "done") {
        updateStepCallback(t("record.audioRecorder.errors.uploadComplete"));
        break;
      }

      if (result.status === "error") {
        throw new Error(
          result.error || t("record.audioRecorder.errors.processingError")
        );
      }

      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    }

    if (!result?.result?.transcription?.full_transcript) {
      throw new Error(t("record.audioRecorder.errors.emptyTranscript"));
    }

    return result.result.transcription.full_transcript;
  } catch (error) {
    console.error("Error during processing:", error.message);
    updateStepCallback(
      t("record.audioRecorder.errors.uploadFailed", {
        errorMessage: error.message,
      })
    );
    throw error;
  }
}
