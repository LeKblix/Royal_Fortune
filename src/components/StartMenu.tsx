
import React, { useState, memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Play, Info, Terminal } from 'lucide-react';
import { getPlayerName, savePlayerName } from '@/utils/leaderboardService';
import RulesDialog from './RulesDialog';
import TerminalConsole from './TerminalConsole'; 

interface StartMenuProps {
  onStartGame: (playerName: string) => void;
  onShowLeaderboard: () => void;
}

const StartMenu = memo(({ onStartGame, onShowLeaderboard }: StartMenuProps) => {
  const [playerName, setPlayerName] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [nameError, setNameError] = useState('');
  
  useEffect(() => {
    // Load the player's name when component mounts
    const savedName = getPlayerName();
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);
  
  const handleStartGame = () => {
    if (!playerName.trim()) {
      setNameError('Veuillez entrer votre pseudo');
      return;
    }
    
    // Save player name and start game
    savePlayerName(playerName);
    onStartGame(playerName);
  };
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gray-900/70 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden">
            <CardHeader className="bg-black/30 border-b border-white/5 relative pb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-white/90 flex items-center">
                  <Trophy className="h-6 w-6 text-amber-300 mr-2" />
                  Royal Fortune
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-white/5 border-white/10 text-white hover:bg-white/10"
                    onClick={() => setShowTerminal(true)}
                  >
                    <Terminal className="h-4 w-4" />
                  </Button>
                  <RulesDialog />
                </div>
              </div>
              <CardDescription className="text-gray-400 mt-2">
                Le jeu de poker qui défie votre stratégie
              </CardDescription>
              <motion.div
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full will-change-transform"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="playerName" className="text-sm text-gray-300">Votre pseudo</label>
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      setNameError('');
                    }}
                    placeholder="Entrez votre pseudo"
                    className="bg-black/20 border-white/10 text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
                  />
                  {nameError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-400"
                    >
                      {nameError}
                    </motion.p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleStartGame}
                  className="w-full py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium border-none shadow-lg transition-all duration-200 hover:shadow-indigo-500/20 hover:shadow-xl"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Jouer
                </Button>
                
                <Button
                  onClick={onShowLeaderboard}
                  variant="outline"
                  className="w-full py-5 bg-white/5 hover:bg-white/10 border-white/10 text-white"
                >
                  <Trophy className="h-5 w-5 mr-2 text-amber-300" />
                  Meilleurs scores
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="bg-black/30 border-t border-white/5 p-4 text-center">
              <p className="text-xs text-gray-500 w-full">Royal Fortune &copy; {new Date().getFullYear()}</p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <TerminalConsole 
        open={showTerminal} 
        onClose={() => setShowTerminal(false)} 
      />
    </>
  );
});

StartMenu.displayName = 'StartMenu';

export default StartMenu;
