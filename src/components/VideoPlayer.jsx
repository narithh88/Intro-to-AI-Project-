import { useEffect, useRef } from "react";

export default function VideoPlayer({ url, playing, volume, playerRef }) {
  if (!url) return null;

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const ytPlayerRef = useRef(null);
  const containerRef = useRef(null);

  // Setting up YouTube IFrame API 
  useEffect(() => {
    if (!isYouTube) return;

    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];

    // Load YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    // Create player once API is ready
    const createPlayer = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      const div = document.createElement("div");
      div.id = "yt-player-div";
      containerRef.current.appendChild(div);

      ytPlayerRef.current = new window.YT.Player("yt-player-div", {
        height: "360",
        width: "640",
        videoId,
        playerVars: { autoplay: 0, controls: 1 },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      ytPlayerRef.current?.destroy();
    };
  }, [url]);

  // Sync playing state to the YouTube player
  useEffect(() => {
    if (!isYouTube || !ytPlayerRef.current) return;
    const player = ytPlayerRef.current;
    if (typeof player.playVideo !== "function") return;
    if (playing) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [playing]);

  // Sync volume to YouTube player
  useEffect(() => {
    if (!isYouTube || !ytPlayerRef.current) return;
    const player = ytPlayerRef.current;
    if (typeof player.setVolume !== "function") return;
    player.setVolume(volume); // 0–100
  }, [volume]);


  // Sync playing state to native video element
  useEffect(() => {
    const video = playerRef?.current;
    if (!video || isYouTube) return;
    if (playing) {
      video.play().catch((e) => console.log("play error", e));
    } else {
      video.pause();
    }
  }, [playing, url]);

  // Sync volume to native video element
  useEffect(() => {
    const video = playerRef?.current;
    if (!video || isYouTube) return;
    video.volume = volume / 100;
  }, [volume, url]);

  if (isYouTube) {
    return (
      <div
        ref={containerRef}
        style={{ width: 640, height: 360, borderRadius: 12, overflow: "hidden" }}
      />
    );
  }

  return (
    <video
      ref={playerRef}
      src={url}
      controls
      width="640"
      height="360"
      style={{ borderRadius: 12, display: "block" }}
    />
  );
}