import { useEffect, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { startIfNeeded, updateTyped, tick, reset as resetTyping } from '../typingSlice';
import { calcWPM, calcCPM, calcAccuracy } from '../../../utils/metrics';
import { useSocket } from '../../multiplayer/hooks/useSocket';

export function useTyping() {
  const dispatch = useAppDispatch();
  const typing = useSelector((s: RootState) => s.typing);
  const [showResults, setShowResults] = useState(false);
  const roomId = useSelector((s: RootState) => s.room.roomId);
  const { sendProgress } = useSocket();
  const { socket } = useSocket();
  const [raceLocked, setRaceLocked] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [startAt, setStartAt] = useState<number | null>(null);

  useEffect(() => {
    // when joining a room, lock until race:start
    setRaceLocked(!!roomId);
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;
    const onStart = (payload: any) => {
      const s = payload?.startAt || payload?.startAt === 0 ? payload.startAt : payload?.startAt;
      const start = s || Date.now();
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

  useEffect(() => {
    let t: any;
    if (typing.status === 'running') t = setInterval(() => dispatch(tick()), 250);
    return () => clearInterval(t);
  }, [typing.status, dispatch]);

  useEffect(() => {
    if (typing.status === 'finished') setShowResults(true);
  }, [typing.status]);

  const handleChange = useCallback((value: string) => {
    if (raceLocked) return; // ignore input until race starts
    if (!typing.startTime && value.length > 0) dispatch(startIfNeeded());
    // prevent paste by slicing to expected length
    dispatch(updateTyped(value.slice(0, typing.text.length)));
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
  }, [dispatch, typing.startTime, typing.text.length]);

  const handleReset = useCallback(() => {
    dispatch(resetTyping());
    setShowResults(false);
  }, [dispatch]);


  const stats = useMemo(() => {
    const wpm = calcWPM(Math.max(0, typing.typed.length - typing.errors), typing.elapsed);
    const cpm = calcCPM(typing.typed.length, typing.elapsed);
    const accuracy = calcAccuracy(typing.typed.length, typing.errors);
    return { wpm, cpm, accuracy, errors: typing.errors, elapsed: typing.elapsed };
  }, [typing]);

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
