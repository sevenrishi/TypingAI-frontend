# Typing Battleground Workflow Redesign

## Overview

The typing battleground has been completely redesigned with a multi-stage workflow that guides players through creating/joining rooms, waiting for other players, and racing in real-time with live progress tracking.

## Workflow Stages

### 1. **Name Entry** (`name-entry`)
- **Component**: `NameEntry.tsx`
- **Description**: Players enter their display name
- **Actions**: Continue to Room Selection
- **UI**: Centered card with text input and continue button

### 2. **Room Selection** (`room-selection`)
- **Component**: `RoomSelection.tsx`
- **Description**: Players choose to create a new room or join an existing one
- **Actions**: 
  - Create Room → Go to Room Waiting (as host)
  - Join Room → Go to Join Room entry
  - Back → Go to Name Entry
- **UI**: Two large action buttons

### 3. **Join Room** (`join-room`)
- **Component**: `JoinRoom.tsx`
- **Description**: Players enter a room code to join an existing battle
- **Actions**:
  - Join → Validate and join the room
  - Back → Return to Room Selection
- **UI**: Room code input field with uppercase formatting
- **Notes**: Code is uppercase only, 6 characters max

### 4. **Room Waiting** (`room-waiting`)
- **Component**: `RoomWaiting.tsx`
- **Description**: Players wait for the race to begin. Host generates the typing script and starts when all players are ready
- **For Host**:
  - Display room code with copy button
  - Generate Script button (generates typing text via AI)
  - Start Race button (enabled only when script is generated AND all players are ready)
  - View list of players
  
- **For Non-Host Players**:
  - View room code
  - View generated script (when available)
  - Ready toggle button
  - View other players and their ready status
  
- **Actions**:
  - Generate Script (host only)
  - Toggle Ready (all players)
  - Start Race (host only, when conditions met)
  - Leave Room
  
- **UI**: Full screen with room info, player list, and action buttons

### 5. **Race Active** (`race-active`)
- **Component**: `BattlegroundPage.tsx` (combined view)
- **Sub-components**:
  - `TypingTest.tsx` - Main typing interface
  - `RaceProgress.tsx` - Live progress for all players
- **Description**: The actual typing race is happening
- **Features**:
  - Real-time typing feedback
  - Live WPM and accuracy tracking
  - Countdown before race starts (5 seconds)
  - Progress bar for all players
  - Finished players move to top with medal indicators
  - "Waiting for others to finish" message
  - Prevent input after typing is complete
  
- **Progress Tracking**:
  - Progress, WPM, and accuracy sent via socket on every keystroke
  - Automatically detects when a player finishes (100% typed)
  - Backend tracks finished players in order
  
- **UI**: Split view with typing area and race leaderboard

### 6. **Race Completed** (`race-completed`)
- **Component**: `RaceResults.tsx`
- **Description**: Shows final standings and results
- **Features**:
  - Ranked results with medals (🥇 🥈 🥉)
  - Stats for each player: WPM, Accuracy, Progress
  - Play Again button (resets race, goes back to Room Waiting)
  - Leave Battleground button (returns to Name Entry)
  
- **UI**: Full screen results display with medal icons

## State Management

### Redux Store (Room Slice)
```typescript
type RoomState = {
  roomId: string | null;           // Current room code
  text: string;                     // Shared typing text
  players: PlayerState[];           // List of players in room
  host: string | null;              // Socket ID of host
  raceStart: number | null;         // Timestamp for race start
  isHost: boolean;                  // Whether current user is host
  workflowStage: WorkflowStage;    // Current UI stage
  finishedPlayers: string[];       // Socket IDs in finish order
  allPlayersFinished: boolean;     // All players have typed the text
}

type PlayerState = {
  id: string;                       // Socket ID
  name: string;                     // Display name
  progress: number;                 // 0-1 (0% to 100%)
  wpm?: number;                     // Words per minute
  accuracy?: number;                // 0-1 decimal accuracy
  ready?: boolean;                  // Player marked ready
  finished?: boolean;               // Player completed typing
}
```

## Socket Events

### Client → Server
- `room:create` - Create a new room with generated text
- `room:join` - Join existing room by code
- `room:progress` - Send typing progress (wpm, accuracy, progress %)
- `player:ready` - Toggle ready status
- `race:start` - Start the race (host only)
- `room:leave` - Leave the room
- `time:request` - Request server time for sync

### Server → Client
- `room:state` - Complete room state update
- `race:start` - Race is starting with countdown
- `room:error` - Error message

## Key Features

### Room Code Management
- Auto-generated 6-character uppercase codes
- Copy button in Room Waiting view
- Shared across all players in a room

### Player Readiness
- Players must mark themselves as ready
- All players must be ready before host can start
- Ready status tracked and displayed in real-time
- Visual indicators (badges) show ready status

### Script Generation
- Host generates AI-created typing text
- Same text used for all players in room
- Generated before race can start
- Shows "Script Ready" status

### Race Mechanics
- 5-second countdown before typing starts
- Progress tracked on every keystroke
- Automatic detection of completion (100% typed)
- Finished players shown in order (1st, 2nd, 3rd, etc.)
- "Waiting for others" message during race
- Results show immediately after all players finish

### Live Progress Display
- Leaderboard sidebar during race
- Sorted by finish order, then by progress
- Color-coded: finished (green) vs racing (blue)
- Medals for top 3 finishers
- WPM and accuracy stats shown per player

## Component Structure

```
BattlegroundPage (Main orchestrator)
├── NameEntry
├── RoomSelection
├── JoinRoom
├── RoomWaiting
│   └── RoomWaiting.tsx
├── Race Active
│   ├── TypingTest.tsx
│   └── RaceProgress.tsx
└── RaceResults
    └── RaceResults.tsx
```

## Flow Diagrams

### Happy Path - Create Room
```
NameEntry → RoomSelection → RoomWaiting (host)
  ↓ (generate script)
  ↓ (other players join)
  ↓ (all ready)
  ↓ (start race)
RaceActive → RaceResults
```

### Happy Path - Join Room
```
NameEntry → RoomSelection → JoinRoom → RoomWaiting (player)
  ↓ (mark ready)
  ↓ (wait for start)
RaceActive → RaceResults
```

## Backend Changes

### Room Completion Tracking
The backend now tracks which players have finished typing:
- `finishedPlayers` array maintains order of completion
- Automatically updated when progress reaches 100%
- Cleared when `race:start` is called for next race
- Included in `room:state` emissions

### Room Cleanup
- `room:leave` removes player from room
- `disconnect` event handles disconnections
- Host reassignment if host leaves
- Finished players list cleaned up appropriately

## Testing Scenarios

### Scenario 1: Two Players, One Room
1. Player A creates room, generates script, marks ready
2. Player B joins same room, marks ready
3. Both start race
4. Both finish at different times
5. Results show in order

### Scenario 2: Join Non-existent Room
1. Player tries to join with invalid code
2. Socket error emitted
3. Error message shown to user

### Scenario 3: Host Disconnects
1. Room exists with multiple players
2. Host disconnects
3. New host assigned from remaining players
4. Race can continue if started, or someone else can start

### Scenario 4: Player Joins After Script Generated
1. Host generates script
2. New player joins
3. New player sees already-generated script
4. Can mark ready and race with others

## Future Enhancements

- [ ] Timeout for inactive rooms
- [ ] Chat during waiting/racing
- [ ] Player reconnection support
- [ ] Statistics/leaderboards
- [ ] Difficulty levels
- [ ] Custom time limits
- [ ] Team battles
