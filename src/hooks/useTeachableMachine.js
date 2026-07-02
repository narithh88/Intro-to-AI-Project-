import { useEffect, useRef, useState, useCallback } from "react";
const tmImage = window.tmImage;

const MODEL_URL = "/model/";

export function useTeachableMachine({ onDetect, minConfidence = 0.9, cooldownMs = 5000 }) {
  const [status, setStatus] = useState({ label: "—", confidence: 0 });
  const modelRef = useRef(null);
  const webcamRef = useRef(null);
  const lastActionTime = useRef(0);
  const rafRef = useRef(null);

  // Load model + start webcam
  const start = useCallback(async () => {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    // Load the Teachable Machine model
    modelRef.current = await tmImage.load(modelURL, metadataURL);

    // Create the webcam helper (width, height, flip)
    webcamRef.current = new tmImage.Webcam(200, 200, true);
    await webcamRef.current.setup();
    await webcamRef.current.play();

    // Attach the webcam canvas to the DOM element with id="webcam-canvas"
    const container = document.getElementById("webcam-canvas");
    if (container) container.appendChild(webcamRef.current.canvas);

    // Start the prediction loop
    loop();
  }, []);

  const stop = useCallback(() => {
  cancelAnimationFrame(rafRef.current);
  webcamRef.current?.stop();
  const container = document.getElementById("webcam-canvas");
  if (container) container.innerHTML = "";
  setStatus({ label: "—", confidence: 0 });
}, []);

  async function loop() {
    webcamRef.current.update(); // grab next frame
    await predict();
    rafRef.current = requestAnimationFrame(loop);
  }

  async function predict() {
    const predictions = await modelRef.current.predict(webcamRef.current.canvas);

    // Find the class with the highest confidence
    const top = predictions.reduce((a, b) => (a.probability > b.probability ? a : b));

    setStatus({ label: top.className, confidence: top.probability });

    // Only fire action if confident enough AND cooldown has passed
    const now = Date.now();
    if (top.probability >= minConfidence && now - lastActionTime.current >= cooldownMs) {
      lastActionTime.current = now;
      onDetect(top.className); // tell the parent what color was seen
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      webcamRef.current?.stop();
    };
  }, []);

  return { status, start, stop };
}