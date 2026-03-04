import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setRoom, setRoomState, setWorkflowStage, leaveRoom, markPlayerFinished, resetBattleState, setRoomIdentity } from '../features/multiplayer/roomSlice';
import { generateMultiplayerText } from '../features/ai/aiMultiplayerSlice';
import { loadText as loadTextAction, reset as resetTyping } from '../features/typing/typingSlice';
import { useSocket } from '../features/multiplayer/hooks/useSocket';
import { useSaveSession } from '../hooks/useSaveSession';
import { calcAccuracy, calcCPM, calcWPM } from '../utils/metrics';

// Components
import NameEntry from '../features/multiplayer/components/NameEntry';
import RoomSelection from '../features/multiplayer/components/RoomSelection';
import JoinRoom from '../features/multiplayer/components/JoinRoom';
import RoomWaiting from '../features/multiplayer/components/RoomWaiting';
import ScriptReview from '../features/multiplayer/components/ScriptReview';
import BattleProgress from '../features/multiplayer/components/BattleProgress';
import BattleResults from '../features/multiplayer/components/BattleResults';
import BattleCountdown from '../features/multiplayer/components/BattleCountdown';
import TypingBattleground from '../features/typing/components/TypingBattleground';

function genRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function BattlegroundPage() {
  const dispatch = useDispatch();
  const { saveSession } = useSaveSession();
  const room = useSelector((s: RootState) => s.room);
  const aiText = useSelector((s: RootState) => s.aiMultiplayer.text);
  const typing = useSelector((s: RootState) => s.typing);

  const [playerName, setPlayerName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [pendingJoinRoom, setPendingJoinRoom] = useState<string | null>(null);
  const battleSavedRef = useRef(false);

  // Handle room state updates from socket
  const onRoomState = useCallback((state: any) => {
    const players = Object.entries(state.players).map(([id, p]: any) => ({
      id,
      name: p.name,
      progress: p.progress,
      wpm: p.wpm,
      accuracy: p.accuracy,
      ready: p.ready,
      finished: p.finished,
    }));
    
    dispatch(setRoomState({
      players,
      host: state.host,
      raceStart: state.raceStart,
      text: state.text,
      finishedPlayers: state.finishedPlayers || [],
    }));

    // If we were joining, consider this a successful join and move to waiting
    if (pendingJoinRoom && room.workflowStage === 'join-room') {
      dispatch(setRoomIdentity({ roomId: pendingJoinRoom, isHost: false }));
      dispatch(setWorkflowStage('room-waiting'));
      setIsLoadingJoin(false);
      setPendingJoinRoom(null);
    }

    // Load text if available
    if (state.text && !typing.text) {
      dispatch(loadTextAction(state.text));
    }
  }, [dispatch, typing.text, pendingJoinRoom, room.workflowStage]);

  const handleRoomClosed = useCallback(() => {
    setJoinError(null);
    setIsLoadingJoin(false);
    setPendingJoinRoom(null);
    dispatch(leaveRoom());
    dispatch(setWorkflowStage('name-entry'));
    setPlayerName('');
  }, [dispatch]);

  const { createRoom, joinRoom, sendProgress, setReady, startBattle, resetBattle, leaveRoom: socketLeaveRoom, socket, setRoomText } = useSocket(
    onRoomState,
    (error) => {
      if (room.workflowStage === 'join-room') {
        setJoinError(error);
        setIsLoadingJoin(false);
        setPendingJoinRoom(null);
      }
    },
    handleRoomClosed
  );

  const isCurrentHost = !!room.host && !!socket?.id
    ? room.host === socket.id
    : room.isHost;

  // Move all players to race-active when race start is broadcast
  useEffect(() => {
    if (room.raceStart && room.workflowStage === 'room-waiting') {
      dispatch(setWorkflowStage('race-active'));
    }
  }, [room.raceStart, room.workflowStage, dispatch]);

  useEffect(() => {
    if (room.workflowStage !== 'race-active') {
      battleSavedRef.current = false;
    }
  }, [room.workflowStage]);

  // Update progress when typing changes
  useEffect(() => {
    if (room.roomId && typing.status === 'running') {
      const progress = typing.text.length > 0 ? typing.typed.length / typing.text.length : 0;
      const wpm = typing.elapsed > 0 ? (typing.typed.length / 5) * (60000 / typing.elapsed) : 0;
      const accuracy = typing.typed.length > 0 ? (typing.typed.length - typing.errors) / typing.typed.length : 1;
      sendProgress(room.roomId, progress, wpm, accuracy);
    }
  }, [typing.typed, typing.elapsed, typing.status, room.roomId, sendProgress]);

  // Detect when user finishes typing
  useEffect(() => {
    if (typing.status === 'finished' && room.roomId && typing.typed.length > 0) {
      // Send final progress with 100% completion
      const accuracy = typing.text.length > 0 ? (typing.text.length - typing.errors) / typing.text.length : 1;
      const wpm = typing.elapsed > 0 ? (typing.typed.length / 5) * (60000 / typing.elapsed) : 0;
      sendProgress(room.roomId, 1.0, wpm, accuracy);
      
      // Mark this player as finished
      dispatch(markPlayerFinished(socket?.id || ''));
    }
  }, [typing.status, room.roomId, typing.typed, typing.errors, typing.elapsed, typing.text, dispatch, socket?.id, sendProgress]);

  useEffect(() => {
    if (battleSavedRef.current) return;
    const myId = socket?.id;
    if (!room.roomId || !myId) return;
    if (typing.status !== 'finished' || typing.typed.length === 0 || !typing.text) return;

    const finishIndex = room.finishedPlayers.indexOf(myId);
    if (finishIndex < 0) return;

    battleSavedRef.current = true;

    const accuracy = calcAccuracy(typing.typed.length, typing.errors);
    const wpm = calcWPM(Math.max(0, typing.typed.length - typing.errors), typing.elapsed);
    const cpm = calcCPM(typing.typed.length, typing.elapsed);

    const opponents = room.players
      .filter(p => p.id !== myId)
      .map(p => p.name)
      .filter(Boolean);
    const opponent = opponents.length ? opponents.join(', ') : undefined;

    let battleResult: 'win' | 'loss' | 'draw' = 'draw';
    if (room.players.length <= 1 && finishIndex >= 0) {
      battleResult = 'win';
    } else if (finishIndex === 0) {
      battleResult = 'win';
    } else if (finishIndex > 0) {
      battleResult = 'loss';
    }

    saveSession({
      type: 'battle',
      wpm,
      cpm,
      accuracy,
      errors: typing.errors,
      duration: typing.elapsed,
      text: typing.text,
      battleResult,
      opponent
    });
  }, [room.roomId, room.finishedPlayers, room.players, socket?.id, typing.status, typing.typed.length, typing.errors, typing.elapsed, typing.text, saveSession]);

  // Handle workflow stage transitions
  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    dispatch(setWorkflowStage('room-selection'));
  };

  const handleCreateRoom = async () => {
    setIsGenerating(true);
    try {
      const roomCode = genRoomCode();
      // create room without text so host can review/generate script before sharing
      createRoom(roomCode, '', playerName);
      dispatch(setRoom({ roomId: roomCode, text: '', isHost: true }));
      // go to script review stage where host can generate and then "use" the script
      dispatch(setWorkflowStage('script-review'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseScript = (scriptText: string) => {
    if (!room.roomId) return;
    // send chosen script to server and update local state
    setRoomText(room.roomId, scriptText);
    dispatch(setRoom({ roomId: room.roomId, text: scriptText, isHost: true }));
    dispatch(loadTextAction(scriptText));
    dispatch(setWorkflowStage('room-waiting'));
  };

  const handleCancelScript = () => {
    // go back to room waiting (no script set)
    dispatch(setWorkflowStage('room-waiting'));
  };

  const handleGenerateScript = async (topic: string, length: 'short' | 'medium' | 'long') => {
    setIsGenerating(true);
    try {
      await dispatch(generateMultiplayerText({ topic: topic || 'General', length }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJoinRoomSubmit = (roomCode: string) => {
    setIsLoadingJoin(true);
    setJoinError(null);
    setPendingJoinRoom(roomCode);
    joinRoom(roomCode, playerName);
  };

  const handleStartBattle = () => {
    if (room.roomId) {
      startBattle(room.roomId);
    }
  };

  const handleToggleReady = (ready: boolean) => {
    if (room.roomId) {
      setReady(room.roomId, ready);
    }
  };

  const handleLeaveRoom = () => {
    if (room.roomId) {
      socketLeaveRoom(room.roomId);
    }
    dispatch(leaveRoom());
    dispatch(setWorkflowStage('name-entry'));
    setPlayerName('');
  };

  const handlePlayAgain = () => {
    // Reset typing/race state and go back to room waiting (same room)
    dispatch(resetTyping());
    dispatch(resetBattleState());
    if (room.roomId) {
      resetBattle(room.roomId);
    }
    dispatch(setWorkflowStage('room-waiting'));
  };

  // Render based on workflow stage
  if (room.workflowStage === 'name-entry') {
    return <NameEntry onNext={handleNameSubmit} />;
  }

  if (room.workflowStage === 'room-selection') {
    return (
      <RoomSelection
        playerName={playerName}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={() => dispatch(setWorkflowStage('join-room'))}
        onBack={() => dispatch(setWorkflowStage('name-entry'))}
      />
    );
  }

  if (room.workflowStage === 'join-room') {
    return (
      <JoinRoom
        playerName={playerName}
        isLoading={isLoadingJoin}
        error={joinError}
        onJoin={handleJoinRoomSubmit}
        onBack={() => dispatch(setWorkflowStage('room-selection'))}
      />
    );
  }

  if (room.workflowStage === 'room-waiting') {
    return (
      <RoomWaiting
        roomCode={room.roomId || ''}
        playerName={playerName}
        isHost={isCurrentHost}
        hostId={room.host || ''}
        currentPlayerId={socket?.id || ''}
        players={room.players}
        textGenerated={room.text.length > 0}
        isGenerating={isGenerating}
        raceStart={room.raceStart}
        onGenerateScript={handleGenerateScript}
        onStartBattle={handleStartBattle}
        onReady={handleToggleReady}
        onLeave={handleLeaveRoom}
      />
    );
  }

  if (room.workflowStage === 'script-review' && room.isHost) {
    return (
      <ScriptReview
        text={aiText}
        isGenerating={isGenerating}
        onGenerate={handleGenerateScript}
        onUseScript={handleUseScript}
        onCancel={handleCancelScript}
      />
    );
  }

  if (room.workflowStage === 'race-active') {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {room.raceStart && <BattleCountdown startAt={room.raceStart} />}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 2xl:col-span-9">
            <TypingBattleground />
          </div>
          <div className="xl:col-span-4 2xl:col-span-3">
            <BattleProgress
              players={room.players}
              finishedPlayerIds={room.finishedPlayers}
              raceActive={true}
            />
          </div>
        </div>

        {room.allPlayersFinished && (
          <div className="mt-6">
            <BattleResults
              players={room.players}
              finishedPlayerIds={room.finishedPlayers}
              onPlayAgain={handlePlayAgain}
              onLeave={handleLeaveRoom}
              textLength={room.text.length}
            />
          </div>
        )}
      </div>
    );
  }

  return <div>Loading...</div>;
}
