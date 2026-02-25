import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { interviewPublicApi, type InterviewPublicData } from "../api/interview";

const COUNTDOWN_SECONDS = 10;

export function useLobby() {
  const { token } = useParams<{ token: string }>();

  const query = useQuery<InterviewPublicData>({
    queryKey: ["interview-public", token],
    queryFn: () => interviewPublicApi.getInterview(token!),
    enabled: !!token,
    staleTime: 60_000,
  });

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [micOn, setMicOn] = useState(true);
  const [micPermission, setMicPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");

  // Request mic permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMicPermission("granted");
        // Stop the stream immediately — we just needed permission
        stream.getTracks().forEach((t) => t.stop());
      })
      .catch(() => {
        setMicPermission("denied");
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    token: token ?? "",
    interview: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    countdown,
    canJoin: countdown === 0 && micPermission === "granted",
    micOn,
    micPermission,
    toggleMic: () => setMicOn((v) => !v),
  };
}
