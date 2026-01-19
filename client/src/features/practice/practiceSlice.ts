import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PracticeState = {
  selectedTime: number | null; // in milliseconds
  scriptMode: 'default' | 'generate';
  customScript: string;
  started: boolean;
  timeRemaining: number;
  scriptSelected: boolean;
};

const initialState: PracticeState = {
  selectedTime: null,
  scriptMode: 'default',
  customScript: '',
  started: false,
  timeRemaining: 0,
  scriptSelected: false,
};

const slice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    selectTime(state, action: PayloadAction<number>) {
      state.selectedTime = action.payload;
      state.timeRemaining = action.payload;
      state.started = false;
      state.scriptSelected = false;
    },
    setScriptMode(state, action: PayloadAction<'default' | 'generate'>) {
      state.scriptMode = action.payload;
      state.scriptSelected = false;
    },
    setCustomScript(state, action: PayloadAction<string>) {
      state.customScript = action.payload;
      state.scriptSelected = true;
    },
    selectDefaultScript(state) {
      state.scriptSelected = true;
    },
    startPractice(state) {
      state.started = true;
    },
    tick(state) {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 250; // tick every 250ms
      }
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { selectTime, setScriptMode, setCustomScript, selectDefaultScript, startPractice, tick, reset } = slice.actions;
export default slice.reducer;
