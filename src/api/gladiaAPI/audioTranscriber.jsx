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

export async function startPreRecordedJob(audioUrl, payload = {}) {
  const finalPayload = {
    audio_url: audioUrl,
    diarization: payload.diarization ?? true,
    detect_language: payload.detect_language ?? true,
    language: payload.language ?? "en",
    sentiment_analysis: payload.sentiment_analysis ?? true,
    enable_code_switching: payload.enable_code_switching ?? true,
    code_switching_config: payload.code_switching_config ?? {
      languages: ["ar", "en", "he"],
    },
    summarization: payload.summarization ?? true,
    summarization_config: payload.summarization_config ?? {
      type: "general",
    },
    named_entity_recognition: payload.named_entity_recognition ?? true,
    structured_data_extraction: payload.structured_data_extraction ?? true,
    structured_data_extraction_config:
      payload.structured_data_extraction_config ?? {
        classes: ["Persons", "Organizations"],
      },
    audio_to_llm: payload.audio_to_llm ?? true,
    audio_to_llm_config: payload.audio_to_llm_config ?? {
      prompts: ["Extract the key points from the transcription"],
    },
  };

  const options = {
    method: "POST",
    headers: {
      "x-gladia-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalPayload),
  };

  try {
    const response = await fetch(API_PRE_RECORDED_URL, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to start processing");
    }

    return await response.json();
  } catch (error) {
    console.error("Error starting pre-recorded job:", error.message);
    throw error;
  }
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

export async function processAudio(file, payload = {}, updateStepCallback) {
  try {
    updateStepCallback("Uploading audio...");
    const uploadResponse = await uploadAudio(file);
    const audioUrl = uploadResponse.audio_url;
    console.log("Uploaded audio file:", uploadResponse);

    updateStepCallback("Starting processing...");
    const jobResponse = await startPreRecordedJob(audioUrl, payload);
    console.log("Started processing job:", jobResponse);
    const jobId = jobResponse.id;

    let result = null;
    const pollingInterval = 5000;
    updateStepCallback("Processing audio...");

    while (true) {
      result = await getPreRecordedResult(jobId);
      console.log("Result:", result);
      if (result.status === "done") {
        updateStepCallback("Upload complete");
        break;
      }

      if (result.status === "error") {
        throw new Error(result.error || "An error occurred during processing.");
      }

      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    }

    const transcript =
      result &&
      result.result &&
      result.result.transcription &&
      result.result.transcription.full_transcript;
    if (!transcript) {
      throw new Error("No transcript was generated.");
    }

    return transcript;
  } catch (error) {
    console.error("Error during processing:", error.message);
    updateStepCallback(`Upload failed: ${error.message}`);
    throw error;
  }
}
