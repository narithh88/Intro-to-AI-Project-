import { useRef, useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import WebcamView from "./components/WebcamView";
import StatusPanel from "./components/StatusPanel";
import { useTeachableMachine } from "./hooks/useTeachableMachine";

export default function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [lastAction, setLastAction] = useState("");
  const playerRef = useRef(null);

  function handleDetect(color) {
    const c = color.trim();
    if (c === "Blue") {
      setPlaying((p) => {
        setLastAction(p ? "Paused ▐▐" : "Resumed ▶");
        return !p;
      });
    } else if (c === "Yellow") {
      setVolume((v) => {
        const next = Math.min(100, v + 10);
        setLastAction(`Volume ↑ ${next}%`);
        return next;
      });
    } else if (c === "Red") {
      setVolume((v) => {
        const next = Math.max(0, v - 10);
        setLastAction(`Volume ↓ ${next}%`);
        return next;
      });
    }
  }

  const { status, start, stop } = useTeachableMachine({
    onDetect: handleDetect,
    minConfidence: 0.9,
    cooldownMs: 5000,
  });

  function handleLoadVideo() {
    setVideoUrl(inputUrl.trim());
    setPlaying(false);
  }

  function handleLocalFile(e) {
    const file = e.target.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
      setPlaying(false);
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 32, background: "#0f0f1a", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>🎨 AI Color Video Controller</h1>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Paste a YouTube URL..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ width: 400, padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 14 }}
        />
        <button onClick={handleLoadVideo} style={{ padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
          Load Video
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <label style={{ cursor: "pointer", color: "#a0aec0", fontSize: 13 }}>
          📁 Or upload a local video file:{" "}
          <input type="file" accept="video/*" onChange={handleLocalFile} style={{ marginLeft: 8 }} />
        </label>
      </div>

      <div style={{ display: "flex", gap: 32, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
        {videoUrl && (
          <VideoPlayer
            url={videoUrl}
            playing={playing}
            volume={volume}
            playerRef={playerRef}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <WebcamView onStart={start} onStop={stop} />
          <StatusPanel
            label={status.label}
            confidence={status.confidence}
            lastAction={lastAction}
            volume={volume}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32, color: "#888", fontSize: 13 }}>
        🔵 Blue = Pause/Play &nbsp;|&nbsp; 🟡 Yellow = Volume Up &nbsp;|&nbsp; 🔴 Red = Volume Down
      </div>
    </div>
  );
}