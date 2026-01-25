import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setRoom, setRoomState, setWorkflowStage, leaveRoom, markPlayerFinished } from '../features/multiplayer/roomSlice';
import { generateText } from '../features/ai/aiSlice';
import { loadText as loadTextAction } from '../features/typing/typingSlice';
import { useSocket } from '../features/multiplayer/hooks/useSocket';

// Components
import NameEntry from '../features/multiplayer/components/NameEntry';
import RoomSelection from '../features/multiplayer/components/RoomSelection';
import JoinRoom from '../features/multiplayer/components/JoinRoom';
import RoomWaiting from '../features/multiplayer/components/RoomWaiting';
import ScriptReview from '../features/multiplayer/components/ScriptReview';
import RaceProgress from '../features/multiplayer/components/RaceProgress';
import RaceResults from '../features/multiplayer/components/RaceResults';
import RaceCountdown from '../features/multiplayer/components/RaceCountdown';
import TypingTest from '../features/typing/components/TypingTest';

function genRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function BattlegroundPage() {
  const dispatch = useDispatch();
  const room = useSelector((s: RootState) => s.room);
  const aiText = useSelector((s: RootState) => s.ai.text);
  const typing = useSelector((s: RootState) => s.typing);

  const [playerName, setPlayerName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);

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
    }));

    // Load text if available
    if (state.text && !typing.text) {
      dispatch(loadTextAction(state.text));
    }
  }, [dispatch, typing.text]);

  const { createRoom, joinRoom, sendProgress, setReady, startRace, leaveRoom: socketLeaveRoom, socket, setRoomText } = useSocket(onRoomState);

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
      await dispatch(generateText({ topic: topic || 'General', length }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJoinRoomSubmit = (roomCode: string) => {
    setIsLoadingJoin(true);
    joinRoom(roomCode, playerName);
    // ensure local state knows the current room id and that this client is not host
    dispatch(setRoom({ roomId: roomCode, text: '', isHost: false }));
    // Room will be joined and state will update via socket callback
    setTimeout(() => {
      dispatch(setWorkflowStage('room-waiting'));
      setIsLoadingJoin(false);
    }, 500);
  };

  const handleStartRace = () => {
    if (room.roomId) {
      startRace(room.roomId);
      dispatch(setWorkflowStage('race-active'));
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
    // Reset typing state and go back to room waiting
    dispatch(setWorkflowStage('room-waiting'));
    // The room state persists, just waiting for new race to start
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
        isHost={room.isHost}
        hostId={room.host || ''}
        currentPlayerId={socket?.id || ''}
        players={room.players}
        textGenerated={room.text.length > 0}
        isGenerating={isGenerating}
        raceStart={room.raceStart}
        onGenerateScript={handleGenerateScript}
        onStartRace={handleStartRace}
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
      <div className="space-y-6 p-4 container mx-auto">
        {room.raceStart && <RaceCountdown startAt={room.raceStart} />}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TypingTest />
          </div>
          <div className="lg:col-span-1">
            <RaceProgress
              players={room.players}
              finishedPlayerIds={room.finishedPlayers}
              raceActive={true}
            />
          </div>
        </div>

        {room.allPlayersFinished && (
          <div className="mt-6">
            <RaceResults
              players={room.players}
              finishedPlayerIds={room.finishedPlayers}
              onPlayAgain={handlePlayAgain}
              onLeave={handleLeaveRoom}
            />
          </div>
        )}
      </div>
    );
  }

  return <div>Loading...</div>;
}
