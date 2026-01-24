import reducer, { loadText, startIfNeeded, updateTyped, finishTest, reset } from './typingSlice';

describe('typingSlice reducer', () => {
  it('trims typed input to text length and finishes when length reached', () => {
    let state = reducer(undefined as any, { type: 'unknown' });
    state = reducer(state, loadText('hello'));
    expect(state.text).toBe('hello');
    expect(state.typed).toBe('');

    // simulate start
    state = reducer(state, startIfNeeded());
    // set startTime to a fixed value so elapsed is deterministic
    state.startTime = Date.now() - 1000;

    // type more chars than text length
    state = reducer(state, updateTyped('helloooooooooooo')); // longer than 'hello'
    expect(state.typed.length).toBe(state.text.length);
    expect(state.typed).toBe('hello');
    expect(state.status).toBe('finished');
    expect(state.elapsed).toBeGreaterThanOrEqual(0);
  });

  it('does not accept updates after finished', () => {
    let state = reducer(undefined as any, { type: 'unknown' });
    state = reducer(state, loadText('abc'));
    state = reducer(state, startIfNeeded());
    state.startTime = Date.now() - 500;
    state = reducer(state, updateTyped('abc'));
    expect(state.status).toBe('finished');
    const prevTyped = state.typed;
    state = reducer(state, updateTyped('abcd')); // should not change
    expect(state.typed).toBe(prevTyped);
  });
});
