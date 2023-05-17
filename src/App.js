import React, { useState, useRef } from "react";
import RecordRTC from "recordrtc";

function App() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const audioPlayerRef = useRef(null);
  const recordRTCRef = useRef(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const options = {
        type: "audio",
        mimeType: "audio/webm",
      };

      const recordRTC = RecordRTC(stream, options);
      recordRTC.startRecording();

      recordRTCRef.current = recordRTC;
      setRecording(true);
    } catch (error) {
      console.error("Error while recording audio:", error);
    }
  }

  function stopRecording() {
    if (recordRTCRef.current) {
      recordRTCRef.current.stopRecording(() => {
        const blob = recordRTCRef.current.getBlob();
        setAudioBlob(blob);
      });
      setRecording(false);
    }
  }

  async function uploadAudio() {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("API_ENDPOINT_URL", {
        method: "POST",
        body: formData,
      });
      console.log("API response:", response);
      // Process the API response as needed
    } catch (error) {
      console.error("Error while uploading audio:", error);
    }
  }

     return (
    <div>
      <button
        className={`button ${recording ? "recording" : ""}`}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <button onClick={uploadAudio} disabled={!audioBlob || recording}>
        Upload Audio
      </button>
      {!recording && audioBlob && (
        <audio ref={audioPlayerRef} src={URL.createObjectURL(audioBlob)} controls />
      )}
    </div>
  );
}

export default App;

