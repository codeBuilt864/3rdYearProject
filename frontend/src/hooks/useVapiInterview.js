import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

function formatDuration(startedAt) {
  const seconds = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0;
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((value) => String(value).padStart(2, "0")).join(":");
}

export default function useVapiInterview({ jobInfoId, jobInfo, candidateName, navigate }) {
  const vapiRef = useRef(null);
  const sessionRef = useRef(null);
  const startPromiseRef = useRef(null);
  const saveQueueRef = useRef(Promise.resolve());
  const finishingRef = useRef(false);
  const startingRef = useRef(false);
  const timerRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [duration, setDuration] = useState("00:00:00");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [micVolume, setMicVolume] = useState(0);

  const save = useCallback(() => {
    const session = sessionRef.current;
    if (!session?.interviewId) return Promise.resolve();
    const snapshot = {
      ...(session.callId ? { vapiCallId: session.callId } : {}),
      duration: session.finalDuration || formatDuration(session.startedAt),
      transcript: [...session.messages],
    };
    // Serialize snapshots so an older request cannot replace newer transcript turns.
    const pending = saveQueueRef.current.catch(() => {}).then(() =>
      axiosInstance.patch(`/api/mock-interview/interviews/${session.interviewId}`, snapshot, { timeout: 15000 })
    );
    saveQueueRef.current = pending;
    return pending;
  }, []);

  const finish = useCallback(async () => {
    if (finishingRef.current) return;
    const session = sessionRef.current;
    if (session?.saved) return;
    if (!session?.startedAt) {
      setStatus("idle");
      return;
    }
    finishingRef.current = true;
    clearInterval(timerRef.current);
    session.finalDuration ||= formatDuration(session.startedAt);
    setDuration(session.finalDuration);
    setStatus("saving");
    try {
      // start() can resolve after call-start; wait for its returned call ID too.
      await startPromiseRef.current?.catch(() => {});
      await save();
      session.saved = true;
      if (vapiRef.current) navigate(`/mockinterview/${jobInfoId}/interviews/${session.interviewId}`);
    } catch (error) {
      console.error("Failed to save interview:", error);
      toast.error("Could not save the interview. Please retry before leaving this page.");
      setStatus("save-error");
    } finally {
      finishingRef.current = false;
    }
  }, [jobInfoId, navigate, save]);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) return;
    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;
    const onStart = () => {
      const session = sessionRef.current;
      if (!session || session.startedAt) return;
      session.startedAt = Date.now();
      setStatus("open");
      let ticks = 0;
      timerRef.current = setInterval(() => {
        setDuration(formatDuration(session.startedAt));
        if (++ticks % 10 === 0) save().catch(console.error);
      }, 1000);
    };
    const onMessage = (message) => {
      if (message.type !== "transcript" || message.transcriptType !== "final" ||
          !["user", "assistant"].includes(message.role) || !message.transcript?.trim()) return;
      const session = sessionRef.current;
      if (!session?.startedAt) return;
      session.messages.push({
        role: message.role,
        content: message.transcript,
        timestamp: Math.max(0, (Date.now() - session.startedAt) / 1000),
      });
      setMessages([...session.messages]);
      // Save each final segment as well as the regular duration checkpoints.
      save().catch(console.error);
    };
    const onEnd = () => {
      clearInterval(timerRef.current);
      setMicVolume(0);
      setVolume(0);
      void finish();
    };
    const onError = (error) => {
      console.error("Vapi error:", error);
      toast.error("Voice connection error. Check microphone permission and your Vapi configuration.");
    };
    vapi.on("call-start", onStart);
    vapi.on("call-end", onEnd);
    vapi.on("message", onMessage);
    vapi.on("volume-level", setVolume);
    vapi.on("local-volume-level", setMicVolume);
    vapi.on("error", onError);

    return () => {
      clearInterval(timerRef.current);
      vapi.removeAllListeners();
      vapiRef.current = null;
      // Best effort checkpoint when navigating away; normal hang-up awaits save().
      if (sessionRef.current?.startedAt && !sessionRef.current.saved) {
        sessionRef.current.finalDuration ||= formatDuration(sessionRef.current.startedAt);
        save().catch(console.error);
      }
      void vapi.stop().catch(console.error);
    };
  }, [finish, save]);

  async function start() {
    if (status !== "idle" || startingRef.current) return;
    const vapi = vapiRef.current;
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
    if (!vapi || !assistantId) {
      toast.error("Configure VITE_VAPI_PUBLIC_KEY and VITE_VAPI_ASSISTANT_ID to start interviews.");
      return;
    }
    startingRef.current = true;
    setStatus("connecting");
    setMessages([]);
    setDuration("00:00:00");
    setIsMuted(false);
    sessionRef.current = null;
    try {
      const { data } = await axiosInstance.post("/api/mock-interview/interviews", { jobInfoId, candidateName });
      if (vapiRef.current !== vapi) return;
      const session = { interviewId: data.interview._id, messages: [], startedAt: null };
      sessionRef.current = session;
      // Use the configured assistant's model, transcriber, and voice.
      startPromiseRef.current = (async () => {
        const call = await vapi.start(assistantId, {
          variableValues: {
            userName: candidateName,
            title: jobInfo.title || "Not Specified",
            description: jobInfo.description,
            experienceLevel: jobInfo.experienceLevel,
            // Support the capitalized variable used by the existing assistant prompt.
            ExperienceLevel: jobInfo.experienceLevel,
          },
          clientMessages: ["transcript"],
        });
        if (!call?.id) throw new Error("Vapi did not create a call");
        session.callId = call.id;
        if (vapiRef.current !== vapi) {
          await vapi.stop();
          return;
        }
        await save();
      })();
      await startPromiseRef.current;
    } catch (error) {
      if (vapiRef.current !== vapi) return;
      console.error("Failed to start interview:", error);
      if (sessionRef.current?.startedAt) {
        // A database checkpoint failure must not reset an active voice call.
        toast.error("Interview connected, but saving failed. Keep this page open and retry saving when the call ends.");
      } else {
        await vapi.stop().catch(console.error);
        setStatus("idle");
        toast.error("Failed to start interview. Check microphone permission and your Vapi assistant.");
      }
    } finally {
      startingRef.current = false;
    }
  }

  function toggleMute() {
    const muted = !isMuted;
    vapiRef.current?.setMuted(muted);
    setIsMuted(muted);
    if (muted) setMicVolume(0);
  }

  async function stop() {
    setStatus("saving");
    try {
      await vapiRef.current?.stop();
      await finish();
    } catch (error) {
      console.error("Failed to end interview:", error);
      setStatus("open");
      toast.error("Could not end the call. Please try again.");
    }
  }

  return { status, messages, duration, isMuted, volume, micVolume, start, stop, toggleMute, retrySave: finish };
}
