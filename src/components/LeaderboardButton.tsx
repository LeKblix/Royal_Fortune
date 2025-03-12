
import React from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LeaderboardButtonProps {
  onClick: () => void;
}

const LeaderboardButton = ({ onClick }: LeaderboardButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10 text-amber-300 hover:text-amber-400"
          >
            <Trophy className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Meilleurs Scores</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LeaderboardButton;
