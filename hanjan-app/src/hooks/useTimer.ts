import { useEffect, useState, useRef, useCallback } from 'react';
import { TIMER_CONSTANTS } from 'hanjan-shared';

interface UseTimerOptions {
  initialSeconds?: number;
  onWarning?: () => void;
  onUrgent?: () => void;
  onExpired?: () => void;
}

export function useTimer({
  initialSeconds = TIMER_CONSTANTS.DEFAULT_DURATION_SECONDS,
  onWarning,
  onUrgent,
  onExpired,
}: UseTimerOptions = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasWarnedRef = useRef(false);
  const hasUrgedRef = useRef(false);
  const hasExpiredRef = useRef(false);
  const onWarningRef = useRef(onWarning);
  const onUrgentRef = useRef(onUrgent);
  const onExpiredRef = useRef(onExpired);

  useEffect(() => { onWarningRef.current = onWarning; }, [onWarning]);
  useEffect(() => { onUrgentRef.current = onUrgent; }, [onUrgent]);
  useEffect(() => { onExpiredRef.current = onExpired; }, [onExpired]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpiredRef.current?.();
          clearInterval(intervalRef.current!);
          return 0;
        }
        if (next <= TIMER_CONSTANTS.URGENT_THRESHOLD_SECONDS && !hasUrgedRef.current) {
          hasUrgedRef.current = true;
          onUrgentRef.current?.();
        }
        if (next <= TIMER_CONSTANTS.WARNING_THRESHOLD_SECONDS && !hasWarnedRef.current) {
          hasWarnedRef.current = true;
          onWarningRef.current?.();
        }
        return next;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const reset = useCallback((newSeconds: number) => {
    hasWarnedRef.current = newSeconds <= TIMER_CONSTANTS.WARNING_THRESHOLD_SECONDS;
    hasUrgedRef.current = newSeconds <= TIMER_CONSTANTS.URGENT_THRESHOLD_SECONDS;
    hasExpiredRef.current = newSeconds <= 0;
    setSeconds(newSeconds);
    if (newSeconds > 0) {
      startInterval();
    }
  }, [startInterval]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const isWarning = seconds <= TIMER_CONSTANTS.WARNING_THRESHOLD_SECONDS && seconds > 0;
  const isUrgent = seconds <= TIMER_CONSTANTS.URGENT_THRESHOLD_SECONDS && seconds > 0;
  const isExpired = seconds <= 0;

  return { seconds, formattedTime: formatTime(seconds), isWarning, isUrgent, isExpired, reset };
}
