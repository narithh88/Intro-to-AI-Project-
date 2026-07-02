// Display settings
export default function WebcamView({ onStart, onStop }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Webcam Feed</h3>
      <div id="webcam-canvas" style={{ display: "inline-block", borderRadius: 8 }} />
      <br />
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
        <button onClick={onStart}>Start Camera</button>
        <button onClick={onStop}>Stop Camera</button>
      </div>
    </div>
  );
}