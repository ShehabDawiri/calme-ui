import React, { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";

export default function TranscriptPage() {
  // const { selectedSession: session_id } = useSession();
  // console.log("sessionId TP +=>",session_id);
  const { selectedSession: session_id } = useSession();
  console.log("selectedSession in TranscriptPage:", session_id);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session_id) {
      setError("No session selected.");
      setLoading(false);
      return;
    }

    const fetchTranscript = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/transcript/${session_id}`);
        const data = await res.json();
        console.log("Fetched transcript data:", data); // ← ADD THIS
        // if (res.ok && data.gladia_response?.results) {
        //   setSegments(data.gladia_response.results);
        if (res.ok && data.results) {
          setSegments(data.results);
        } else {
          setError("Transcript not found or not yet processed.");
        }
      } catch {
        setError("Failed to fetch transcript.");
      } finally {
        setLoading(false);
      }
    };


    fetchTranscript();
  }, [session_id]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Transcript</h1>

      {loading ? (
        <p className="text-gray-500 italic">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : segments.length === 0 ? (
        <p className="italic text-gray-500">No transcript data available.</p>
      ) : (
        <div className="space-y-3 text-gray-800">
          {segments.map((seg, idx) => {
            const label = seg.speaker === 0 ? "Therapist" : "Client";
            return (
              <p key={idx} className="leading-relaxed">
                <span className="font-medium">{label}:</span> {seg.text}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
