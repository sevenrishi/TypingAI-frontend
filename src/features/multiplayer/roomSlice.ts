import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PlayerState = { id: string; name: string; progress: number; wpm?: number; accuracy?: number; ready?: boolean; finished?: boolean };

export type WorkflowStage = 'name-entry' | 'room-selection' | 'script-review' | 'room-waiting' | 'join-room' | 'race-active' | 'race-completed';

type RoomState = {
  roomId: null | string;
  text: string;
  players: PlayerState[];
  host: null | string;
  raceStart: null | number;
  isHost: boolean;
  workflowStage: WorkflowStage;
  finishedPlayers: string[]; // socket ids of finished players
  allPlayersFinished: boolean;
};

const initialState: RoomState = {
  roomId: null,
  text: '',
  players: [],
  host: null,
  raceStart: null,
  isHost: false,
  workflowStage: 'name-entry',
  finishedPlayers: [],
  allPlayersFinished: false,
};

const slice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setPlayerName(state, action: PayloadAction<string>) {
      // Store player name during entry phase
    },
    setWorkflowStage(state, action: PayloadAction<WorkflowStage>) {
      state.workflowStage = action.payload;
    },
    setRoom(state, action: PayloadAction<{ roomId: string; text: string; isHost: boolean }>) {
      state.roomId = action.payload.roomId;
      state.text = action.payload.text;
      state.isHost = action.payload.isHost;
      state.players = [];
      state.host = null;
      state.raceStart = null;
      state.finishedPlayers = [];
      state.allPlayersFinished = false;
    },
    setRoomState(state, action: PayloadAction<{ players: PlayerState[]; host?: string | null; raceStart?: number | null; text?: string }>) {
      state.players = action.payload.players;
      if (action.payload.host !== undefined) state.host = action.payload.host || null;
      if (action.payload.raceStart !== undefined) state.raceStart = action.payload.raceStart || null;
      if (action.payload.text !== undefined) state.text = action.payload.text || '';
    },
    markPlayerFinished(state, action: PayloadAction<string>) {
      const playerId = action.payload;
      if (!state.finishedPlayers.includes(playerId)) {
        state.finishedPlayers.push(playerId);
      }
      // Check if all players finished
      const allFinished = state.players.every(p => state.finishedPlayers.includes(p.id));
      if (allFinished) {
        state.allPlayersFinished = true;
      }
    },
    resetRaceState(state) {
      state.finishedPlayers = [];
      state.allPlayersFinished = false;
    },
    leaveRoom(state) {
      Object.assign(state, initialState);
      state.workflowStage = 'name-entry';
    }
  }
});

export const { setPlayerName, setWorkflowStage, setRoom, setRoomState, markPlayerFinished, resetRaceState, leaveRoom } = slice.actions;
export default slice.reducer;
