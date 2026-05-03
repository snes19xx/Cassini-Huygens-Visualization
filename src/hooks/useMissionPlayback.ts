import { useEffect, useRef } from "react";
import { useMissionStore } from "../store/missionStore";

// Total animation duration at 1x playback speed, in seconds.
// The Cassini mission spanned 13 years. I compress it into 90 seconds at 1x.
const FULL_MISSION_SECONDS = 90;

export function useMissionPlayback() {
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const s = useMissionStore.getState();
      if (!s.isPlaying) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const advance = (dt * s.playbackSpeed) / FULL_MISSION_SECONDS;
      const next = s.currentT + advance;

      if (next >= 1) {
        useMissionStore.setState({ currentT: 1, isPlaying: false });
        rafRef.current = null;
        return;
      }

      s.setTime(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
}
