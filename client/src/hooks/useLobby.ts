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
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(
      () => setCountdown((c) => (c <= 1 ? (clearInterval(timer), 0) : c - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  return {
    token: token ?? "",
    interview: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    countdown,
    canJoin: countdown === 0,
    micOn,
    camOn,
    toggleMic: () => setMicOn((v) => !v),
    toggleCam: () => setCamOn((v) => !v),
  };
}
