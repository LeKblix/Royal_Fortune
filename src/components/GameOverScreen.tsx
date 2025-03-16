
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { isHighScore } from '@/utils/leaderboardService';

interface GameOverScreenProps {
  score: number;
  level: number;
  onBackToMenu: () => void;
  onSaveScore: () => void;
}

const GameOverScreen = ({ score, level, onBackToMenu, onSaveScore }: GameOverScreenProps) => {
  const isHigh = isHighScore(score);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-xl shadow-2xl text-center space-y-6 max-w-md w-full mx-4 border border-white/5"
      >
        <Trophy className="h-16 w-16 mx-auto text-amber-300" />
        <h2 className="text-3xl font-bold text-white/90">Partie Terminée !</h2>
        
        <div className="space-y-4">
          <div className="bg-black/20 rounded-xl border border-white/5 p-4">
            <p className="text-gray-400 mb-1">Score Final</p>
            <p className="text-4xl font-bold text-amber-300">
              {score}
            </p>
          </div>
          
          <div className="bg-black/20 rounded-xl border border-white/5 p-4">
            <p className="text-gray-400 mb-1">Niveau Atteint</p>
            <p className="text-4xl font-bold text-white/90">{level}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {isHigh && (
            <Button
              onClick={onSaveScore}
              className="w-full bg-amber-300/10 hover:bg-amber-300/20 text-amber-300 border border-amber-300/20 font-medium rounded-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer le Score
            </Button>
          )}
          
          <Button
            onClick={onBackToMenu}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 font-medium rounded-lg"
          >
            Retour au Menu
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen;
