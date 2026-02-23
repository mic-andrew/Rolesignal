import { useState, useEffect } from "react";

const COUNTDOWN_SECONDS = 10;

export function useLobby() {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [micOn, setMicOn]         = useState(true);
  const [camOn, setCamOn]         = useState(true);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(
      () => setCountdown((c) => (c <= 1 ? (clearInterval(timer), 0) : c - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  return {
    countdown,
    canJoin: countdown === 0,
    micOn,
    camOn,
    toggleMic: () => setMicOn((v) => !v),
    toggleCam: () => setCamOn((v) => !v),
  };
}
