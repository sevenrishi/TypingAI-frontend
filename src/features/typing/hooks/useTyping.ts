import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { startIfNeeded, setStartTime, updateTyped, tick, finishTest, reset as resetTyping } from '../typingSlice';
import { calcWPM, calcCPM, calcAccuracy } from '../../../utils/metrics';
import { useSocket } from '../../multiplayer/hooks/useSocket';

export function useTyping() {
  const dispatch = useAppDispatch();
  const typing = useSelector((s: RootState) => s.typing);
  const [showResults, setShowResults] = useState(false);
  const roomId = useSelector((s: RootState) => s.room.roomId);
  const { sendProgress, socket } = useSocket();
  const [raceLocked, setRaceLocked] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [startAt, setStartAt] = useState<number | null>(null);
  
  // Use ref to freeze elapsed time when test finishes
  const frozenElapsedRef = useRef<number | null>(null);

  useEffect(() => {
    // when joining a room, lock until race:start
    setRaceLocked(!!roomId);
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;
    const onStart = (payload: any) => {
      const start = (payload && typeof payload.startAt === 'number') ? payload.startAt : Date.now();
      setStartAt(start);
      setRaceLocked(true);
      // compute countdown and unlock at start
      const update = () => {
        const offset = (window as any).__TYPING_TIME_OFFSET || 0;
        const localStart = start - offset;
        const remain = Math.max(0, Math.ceil((localStart - Date.now()) / 1000));
        setCountdown(remain);
        if (Date.now() >= localStart) {
          setRaceLocked(false);
          // Use server synced start time to set typing.startTime so elapsed is consistent
          try {
            dispatch(setStartTime(localStart));
            console.debug('[useTyping] dispatched setStartTime', { localStart });
          } catch (err) {
            console.warn('[useTyping] failed to dispatch setStartTime', err);
          }
          setCountdown(null);
          setStartAt(null);
          clearInterval(interval);
        }
      };
      update();
      const interval = setInterval(update, 250);
    };
    socket.on('race:start', onStart);
    return () => { socket.off('race:start', onStart); };
  }, [socket]);

  // Use ref to track current status for interval callback
  const statusRef = useRef<string>(typing.status);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    statusRef.current = typing.status;
  }, [typing.status]);

  useEffect(() => {
    // Clear any existing interval
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    if (typing.status === 'running') {
      timerIdRef.current = setInterval(() => {
        // Guard: only dispatch tick if still running
        if (statusRef.current === 'running' && timerIdRef.current) {
          dispatch(tick());
        }
      }, 250);
    }
    
    // Clean up interval when status changes or component unmounts
    return () => {
      if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [typing.status, dispatch]);

  // Defensive: if typed text equals target text (from store) ensure test is finished
  useEffect(() => {
    if (!typing.text) return;
    if (typing.status === 'finished') return;
    // If stored typed equals target, finish immediately
    if (typing.typed === typing.text) {
      dispatch(finishTest());
      frozenElapsedRef.current = typing.startTime ? Date.now() - typing.startTime : 0;
      setShowResults(true);
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    }
  }, [typing.typed, typing.text, typing.status, typing.startTime, dispatch]);

  useEffect(() => {
    if (typing.status === 'finished') {
      // Capture and freeze elapsed time
      console.debug('[useTyping] status finished', { elapsed: typing.elapsed, typed: typing.typed, text: typing.text });
      frozenElapsedRef.current = typing.elapsed;
      setShowResults(true);
    } else if (typing.status === 'idle') {
      // Reset when test resets
      console.debug('[useTyping] status idle');
      frozenElapsedRef.current = null;
    }
  }, [typing.status, typing.elapsed]);

  const handleChange = useCallback((value: string) => {
    // Don't process input if test is already finished
    if (typing.status === 'finished') return;
    if (raceLocked) return; // ignore input until race starts
    if (!typing.startTime && value.length > 0) dispatch(startIfNeeded());
    // prevent paste by slicing to expected length
    const sliced = value.slice(0, typing.text.length);

    // Debugging: log lengths and values to help track why input may overflow
    console.debug('[useTyping] handleChange', {
      incoming: value,
      incomingLength: value.length,
      textLength: typing.text.length,
      slicedLength: sliced.length,
      currentTypedLength: typing.typed.length,
      status: typing.status,
    });

    dispatch(updateTyped(sliced));
    // If user has completed the full text, ensure we finish immediately
    if (sliced === typing.text) {
      // dispatch finish to mark test finished and freeze elapsed
      console.debug('[useTyping] user completed text by equality check');
      dispatch(finishTest());
      // freeze elapsed locally in case reducer timing is slightly delayed
      frozenElapsedRef.current = typing.startTime ? Date.now() - typing.startTime : 0;
      setShowResults(true);
      // clear internal interval if running
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    }
    // send progress to server if in a room
    try {
      if (roomId) {
        const progress = typing.text.length ? (Math.min(value.length, typing.text.length) / typing.text.length) : 0;
        const wpm = calcWPM(Math.max(0, value.length - typing.errors), typing.elapsed);
        const accuracy = calcAccuracy(value.length, typing.errors);
        sendProgress(roomId, progress, wpm, accuracy);
      }
    } catch (err) {
      // ignore socket errors locally
    }
  }, [dispatch, typing.startTime, typing.text.length, typing.text, raceLocked, typing.status]);

  const handleReset = useCallback(() => {
    dispatch(resetTyping());
    setShowResults(false);
  }, [dispatch]);


  const stats = useMemo(() => {
    // Use frozen elapsed time if test is finished, otherwise use current elapsed
    const elapsedTime = typing.status === 'finished' && frozenElapsedRef.current !== null 
      ? frozenElapsedRef.current 
      : typing.elapsed;
    
    const wpm = calcWPM(Math.max(0, typing.typed.length - typing.errors), elapsedTime);
    const cpm = calcCPM(typing.typed.length, elapsedTime);
    const accuracy = calcAccuracy(typing.typed.length, typing.errors);
    return { wpm, cpm, accuracy, errors: typing.errors, elapsed: elapsedTime };
  }, [typing.status === 'finished' ? frozenElapsedRef.current : typing.elapsed, typing.typed.length, typing.errors, typing.status]);

  return {
    typed: typing.typed,
    text: typing.text,
    status: typing.status,
    stats,
    showResults,
    setShowResults,
    handleChange,
    handleReset
    , raceLocked, countdown
  };
}
