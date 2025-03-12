
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreLevelsProps {
  multipliers: {
    pair: number;
    brelan: number;
    straight: number;
    flush?: number;
    full?: number;
    carre?: number;
    straightFlush?: number;
    doublePaire?: number;
  }
}

const ScoreLevels = ({ multipliers }: ScoreLevelsProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white/90">Multiplicateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {multipliers.pair > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Paire</span>
              <span className="text-amber-400 font-bold">×{multipliers.pair.toFixed(1)}</span>
            </div>
          )}
          {multipliers.doublePaire > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Double Paire</span>
              <span className="text-amber-400 font-bold">×{multipliers.doublePaire.toFixed(1)}</span>
            </div>
          )}
          {multipliers.brelan > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Brelan</span>
              <span className="text-amber-400 font-bold">×{multipliers.brelan.toFixed(1)}</span>
            </div>
          )}
          {multipliers.straight > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Quinte</span>
              <span className="text-amber-400 font-bold">×{multipliers.straight.toFixed(1)}</span>
            </div>
          )}
          {multipliers.flush > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Couleur</span>
              <span className="text-amber-400 font-bold">×{multipliers.flush.toFixed(1)}</span>
            </div>
          )}
          {multipliers.full > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Full</span>
              <span className="text-amber-400 font-bold">×{multipliers.full.toFixed(1)}</span>
            </div>
          )}
          {multipliers.carre > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Carré</span>
              <span className="text-amber-400 font-bold">×{multipliers.carre.toFixed(1)}</span>
            </div>
          )}
          {multipliers.straightFlush > 1 && (
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg backdrop-blur-md">
              <span className="text-white/80 font-medium">Quinte Flush</span>
              <span className="text-amber-400 font-bold">×{multipliers.straightFlush.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreLevels;
