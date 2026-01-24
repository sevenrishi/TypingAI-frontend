import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PlayerState = { id: string; name: string; progress: number; wpm?: number; accuracy?: number };

const slice = createSlice({
  name: 'room',
  initialState: { roomId: null as string | null, text: '', players: [] as PlayerState[], host: null as string | null, raceStart: null as number | null },
  reducers: {
    setRoom(state, action: PayloadAction<{ roomId: string; text: string }>) {
      state.roomId = action.payload.roomId;
      state.text = action.payload.text;
      state.players = [];
      state.host = null;
      state.raceStart = null;
    },
    setRoomState(state, action: PayloadAction<{ players: PlayerState[]; host?: string | null; raceStart?: number | null; text?: string }>) {
      state.players = action.payload.players;
      if (action.payload.host !== undefined) state.host = action.payload.host || null;
      if (action.payload.raceStart !== undefined) state.raceStart = action.payload.raceStart || null;
      if (action.payload.text !== undefined) state.text = action.payload.text || '';
    },
    leaveRoom(state) {
      state.roomId = null;
      state.text = '';
      state.players = [];
      state.host = null;
      state.raceStart = null;
    }
  }
});

export const { setRoom, setRoomState, leaveRoom } = slice.actions;
export default slice.reducer;
