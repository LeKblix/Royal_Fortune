
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shuffle, HandMetal } from 'lucide-react';

interface GameStatsProps {
  remainingHands: number;
  discardCount: number;
}

const GameStats = ({ remainingHands, discardCount }: GameStatsProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white/90">Stats de la partie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <HandMetal className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-sm text-white/60">Mains Restantes</p>
              <p className="text-3xl font-bold text-white">{remainingHands}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Shuffle className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-sm text-white/60">Défausses</p>
              <p className="text-3xl font-bold text-white">{discardCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;
