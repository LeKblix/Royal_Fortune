
import React from 'react';
import { Trophy } from 'lucide-react';
import { CardTitle } from '@/components/ui/card';
import RulesDialog from './RulesDialog';
import LeaderboardButton from './LeaderboardButton';

interface GameHeaderProps {
  onShowLeaderboard: () => void;
}

const GameHeader = ({ onShowLeaderboard }: GameHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-amber-300" />
        <span className="text-xl font-bold text-white/90">
          Royal Fortune
        </span>
      </CardTitle>
      <div className="flex items-center gap-2">
        <LeaderboardButton onClick={onShowLeaderboard} />
        <RulesDialog />
      </div>
    </div>
  );
};

export default GameHeader;
