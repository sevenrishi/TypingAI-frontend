import React from 'react';
import RaceUI from '../features/multiplayer/components/RaceUI';
import TypingTest from '../features/typing/components/TypingTest';

export default function BattlegroundPage() {
  return (
    <div className="space-y-8">
      <RaceUI />
      <TypingTest />
    </div>
  );
}
