
import React, { useState } from 'react';
import { Trophy, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export interface PlayerScore {
  id: string;
  playerName: string;
  score: number;
  level: number;
  date: string;
}

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
  scores: PlayerScore[];
  currentScore?: number;
  currentLevel?: number;
  onSaveScore?: (playerName: string) => void;
}

const Leaderboard = ({ 
  open, 
  onClose, 
  scores, 
  currentScore, 
  currentLevel,
  onSaveScore 
}: LeaderboardProps) => {
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSaveScore = () => {
    if (playerName.trim() && onSaveScore) {
      onSaveScore(playerName);
      setSaved(true);
    }
  };

  const sortedScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900/90 border border-white/10 backdrop-blur-xl max-w-lg w-full rounded-xl shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-black/30 p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-300" />
              <DialogTitle className="text-xl font-bold text-white">Meilleurs Scores</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-gray-400 hover:text-white hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">
            Les 10 meilleurs scores de Royal Fortune
          </DialogDescription>
        </DialogHeader>

        {currentScore !== undefined && !saved && (
          <div className="p-4 bg-amber-500/10 border-b border-amber-500/20">
            <p className="text-amber-300 font-medium mb-2">Enregistrez votre score !</p>
            <div className="flex gap-2">
              <Input
                placeholder="Votre nom"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-black/30 border-white/10 text-white"
                maxLength={15}
              />
              <Button onClick={handleSaveScore} className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30">
                Sauvegarder
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 max-h-80 overflow-auto">
          <div className="space-y-1">
            {sortedScores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Users className="h-12 w-12 mb-2 opacity-30" />
                <p>Aucun score enregistré</p>
              </div>
            ) : (
              sortedScores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === 0 
                      ? 'bg-amber-500/20 border border-amber-500/30' 
                      : index < 3 
                        ? 'bg-white/5 border border-white/10' 
                        : 'bg-black/20 border border-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 
                      ? 'bg-amber-500 text-black' 
                      : index === 1 
                        ? 'bg-gray-300 text-black' 
                        : index === 2 
                          ? 'bg-amber-700 text-white' 
                          : 'bg-gray-800 text-gray-400'
                  } font-bold text-sm`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className={`font-bold ${
                      index === 0 
                        ? 'text-amber-300' 
                        : index < 3 
                          ? 'text-white' 
                          : 'text-gray-300'
                    }`}>
                      {score.playerName}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Niveau {score.level}</span>
                      <span>•</span>
                      <span>{new Date(score.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${
                    index === 0 
                      ? 'text-amber-300' 
                      : index < 3 
                        ? 'text-white' 
                        : 'text-gray-300'
                  }`}>
                    {score.score.toLocaleString()}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
