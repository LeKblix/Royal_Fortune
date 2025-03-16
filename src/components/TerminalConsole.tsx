import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { createDeck, checkHand } from '../utils/pokerHands';
import { saveScore, savePlayerName, loadScores } from '../utils/leaderboardService';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalConsoleProps {
  open: boolean;
  onClose: () => void;
}

const TerminalConsole = ({ open, onClose }: TerminalConsoleProps) => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string[]>([
    'Royal Fortune - Version Terminal',
    'Tapez "aide" pour voir les commandes disponibles.',
    '> '
  ]);
  const [minimized, setMinimized] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [hand, setHand] = useState<any[]>([]);
  const [deck, setDeck] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [objective, setObjective] = useState(150);
  const [remainingHands, setRemainingHands] = useState(5);
  const [discardCount, setDiscardCount] = useState(3);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'leaderboard' | 'gameover'>('menu');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const OBJECTIVES = [
    150, 450, 1000, 2000, 3500, 5500, 8000, 11000, 15000, 20000
  ];

  useEffect(() => {
    if (open && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      inputRef.current?.focus();
    }
  }, [open, output]);

  // Display initial menu when component mounts
  useEffect(() => {
    if (gameState === 'menu') {
      const newOutput = [...output];
      displayMenu(newOutput);
      setOutput(newOutput);
    }
  }, []);

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let newOutput = [...output, `> ${cmd}`];

    if (gameState === 'menu') {
      handleMenuCommand(command, newOutput);
    } else if (gameState === 'playing') {
      handleGameCommand(command, newOutput);
    } else if (gameState === 'leaderboard') {
      handleLeaderboardCommand(command, newOutput);
    } else if (gameState === 'gameover') {
      handleGameOverCommand(command, newOutput);
    }
  };

  const handleMenuCommand = (command: string, newOutput: string[]) => {
    if (command === '1' || command === 'jouer') {
      newOutput.push('Démarrage d\'une nouvelle partie...');
      startNewGame();
      setGameState('playing');
      displayHand(newOutput);
    } else if (command === '2' || command === 'scores') {
      newOutput.push('Meilleurs scores:');
      const scores = loadScores();
      if (scores.length === 0) {
        newOutput.push('Aucun score enregistré.');
      } else {
        scores.slice(0, 10).forEach((s: any, i: number) => {
          newOutput.push(`${i + 1}. ${s.playerName}: ${s.score} (Niveau ${s.level})`);
        });
      }
      newOutput.push('Tapez "menu" pour revenir au menu principal.');
      setGameState('leaderboard');
    } else if (command === '3' || command === 'quitter') {
      newOutput.push('Fermeture du terminal...');
      setTimeout(onClose, 1000);
    } else if (command === 'aide') {
      newOutput.push(
        'Commandes disponibles:',
        '1 ou jouer - Démarrer une nouvelle partie',
        '2 ou scores - Voir les meilleurs scores',
        '3 ou quitter - Fermer le terminal',
        'aide - Afficher cette aide'
      );
    } else {
      newOutput.push(`Commande inconnue: ${command}`);
      newOutput.push('Tapez "aide" pour voir les commandes disponibles.');
    }
    setOutput(newOutput);
  };

  const handleGameCommand = (command: string, newOutput: string[]) => {
    if (command === 'aide') {
      newOutput.push(
        'Commandes de jeu:',
        '1-8 - Sélectionner/désélectionner une carte',
        'j ou jouer - Jouer les cartes sélectionnées',
        'd ou defausser - Défausser les cartes sélectionnées',
        'stats - Afficher les statistiques actuelles',
        'h ou historique - Voir l\'historique des mains',
        'q ou quitter - Quitter la partie'
      );
    } else if (command === 'q' || command === 'quitter') {
      newOutput.push('Retour au menu principal...');
      displayMenu(newOutput);
      setGameState('menu');
    } else if (command === 'stats') {
      displayStats(newOutput);
    } else if (command === 'h' || command === 'historique') {
      newOutput.push('Fonctionnalité d\'historique à implémenter');
    } else if (command === 'j' || command === 'jouer') {
      if (selectedCards.length === 0) {
        newOutput.push('Erreur: Aucune carte sélectionnée');
      } else {
        playSelectedCards(newOutput);
      }
    } else if (command === 'd' || command === 'defausser') {
      if (selectedCards.length === 0) {
        newOutput.push('Erreur: Aucune carte sélectionnée');
      } else if (discardCount <= 0) {
        newOutput.push('Erreur: Vous n\'avez plus de défausses disponibles');
      } else {
        discardSelectedCards(newOutput);
      }
    } else if (/^[1-8]$/.test(command)) {
      const cardIndex = parseInt(command) - 1;
      if (cardIndex >= 0 && cardIndex < hand.length) {
        toggleCardSelection(cardIndex, newOutput);
      } else {
        newOutput.push(`Erreur: Carte ${cardIndex + 1} inexistante`);
      }
    } else {
      newOutput.push(`Commande inconnue: ${command}`);
      newOutput.push('Tapez "aide" pour voir les commandes disponibles.');
    }
    setOutput(newOutput);
  };

  const handleLeaderboardCommand = (command: string, newOutput: string[]) => {
    if (command === 'menu') {
      displayMenu(newOutput);
      setGameState('menu');
    } else {
      newOutput.push('Tapez "menu" pour revenir au menu principal.');
      setOutput(newOutput);
    }
  };

  const handleGameOverCommand = (command: string, newOutput: string[]) => {
    if (command === 'menu') {
      displayMenu(newOutput);
      setGameState('menu');
    } else if (command.startsWith('nom ')) {
      const playerName = command.substring(4).trim();
      if (playerName) {
        saveScore(playerName, score, level);
        newOutput.push(`Score enregistré pour ${playerName}`);
        newOutput.push('Tapez "menu" pour revenir au menu principal.');
      } else {
        newOutput.push('Veuillez entrer un nom valide: nom <votre_nom>');
      }
    } else {
      newOutput.push('Tapez "nom <votre_nom>" pour enregistrer votre score');
      newOutput.push('ou "menu" pour revenir au menu principal sans enregistrer.');
      setOutput(newOutput);
    }
  };

  const displayMenu = (newOutput: string[]) => {
    newOutput.push(
      '\nRoyal Fortune - Menu Principal',
      '1. Jouer',
      '2. Meilleurs Scores',
      '3. Quitter',
      '\nEntrez votre choix:'
    );
  };

  const displayHand = (newOutput: string[]) => {
    newOutput.push('\nMain actuelle:');
    hand.forEach((card, index) => {
      const isSelected = selectedCards.includes(index);
      const cardDisplay = `${isSelected ? '[X]' : '[ ]'} ${index + 1}: ${card.value}${card.suit}`;
      newOutput.push(cardDisplay);
    });
    newOutput.push('\nCommandes: 1-8 (sélectionner), j (jouer), d (défausser), aide');
  };

  const displayStats = (newOutput: string[]) => {
    newOutput.push(
      '\nStatistiques:',
      `Niveau: ${level}`,
      `Score: ${score}`,
      `Objectif: ${objective}`,
      `Mains restantes: ${remainingHands}`,
      `Défausses restantes: ${discardCount}`
    );
  };

  const startNewGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck.slice(8));
    setHand(newDeck.slice(0, 8));
    setSelectedCards([]);
    setScore(0);
    setLevel(1);
    setObjective(OBJECTIVES[0]);
    setRemainingHands(5);
    setDiscardCount(3);
  };

  const toggleCardSelection = (index: number, newOutput: string[]) => {
    setSelectedCards(prev => {
      const isSelected = prev.includes(index);
      if (isSelected) {
        newOutput.push(`Carte ${index + 1} désélectionnée`);
        return prev.filter(idx => idx !== index);
      } else {
        newOutput.push(`Carte ${index + 1} sélectionnée`);
        return [...prev, index];
      }
    });
    displayHand(newOutput);
  };

  const playSelectedCards = (newOutput: string[]) => {
    const selectedCardsList = selectedCards.map(index => hand[index]);
    
    const result = checkHand(selectedCardsList);
    
    if (result.points > 0) {
      const newScore = score + result.points;
      setScore(newScore);
      setRemainingHands(prev => prev - 1);
      
      newOutput.push(`Combinaison: ${result.type}`);
      newOutput.push(`Points gagnés: ${result.points}`);
      newOutput.push(`Nouveau score: ${newScore}`);
      
      if (newScore >= objective) {
        if (level < OBJECTIVES.length) {
          setLevel(prev => prev + 1);
          setObjective(OBJECTIVES[level]);
          setRemainingHands(5);
          setDiscardCount(3);
          newOutput.push(`Niveau ${level} complété! Vous passez au niveau ${level + 1}.`);
          newOutput.push('Mains et défausses réinitialisées.');
        } else {
          gameOver(newOutput, true);
          return;
        }
      } else if (remainingHands <= 1) {
        gameOver(newOutput, false);
        return;
      }
      
      const newHand = [...hand];
      const indices = [...selectedCards].sort((a, b) => a - b);
      
      let currentDeck = [...deck];
      if (currentDeck.length < indices.length) {
        currentDeck = createDeck();
        setDeck(currentDeck);
      }
      
      for (let i = 0; i < indices.length; i++) {
        if (i < currentDeck.length) {
          newHand[indices[i]] = currentDeck[i];
        }
      }
      
      setHand(newHand);
      setDeck(currentDeck.slice(indices.length));
      setSelectedCards([]);
      
      newOutput.push('\nNouvelles cartes piochées.');
      displayHand(newOutput);
    } else {
      newOutput.push('Pas de combinaison valide. Essayez une autre sélection.');
    }
  };

  const discardSelectedCards = (newOutput: string[]) => {
    const selectedCount = selectedCards.length;
    
    if (selectedCount > 5) {
      newOutput.push('Erreur: Vous ne pouvez défausser que 5 cartes maximum à la fois!');
      return;
    }
    
    if (discardCount <= 0) {
      newOutput.push('Erreur: Vous n\'avez plus de défausses disponibles!');
      return;
    }
    
    const newHand = [...hand];
    let currentDeck = [...deck];
    
    if (currentDeck.length < selectedCount) {
      currentDeck = createDeck();
      setDeck(currentDeck);
    }
    
    for (let i = 0; i < selectedCards.length; i++) {
      const index = selectedCards[i];
      if (i < currentDeck.length) {
        newHand[index] = currentDeck[i];
      }
    }
    
    setHand(newHand);
    setDeck(currentDeck.slice(selectedCount));
    setDiscardCount(prev => prev - 1);
    setSelectedCards([]);
    
    newOutput.push(`Cartes défaussées. Il vous reste ${discardCount - 1} défausses.`);
    displayHand(newOutput);
  };

  const gameOver = (newOutput: string[], isWin: boolean) => {
    if (isWin) {
      newOutput.push('Félicitations! Vous avez terminé tous les niveaux!');
    } else {
      newOutput.push('Game Over! Vous n\'avez pas atteint l\'objectif.');
    }
    
    newOutput.push(`Score final: ${score}`);
    newOutput.push(`Niveau atteint: ${level}`);
    newOutput.push('\nTapez "nom <votre_nom>" pour enregistrer votre score');
    newOutput.push('ou "menu" pour revenir au menu principal sans enregistrer.');
    
    setGameState('gameover');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        handleCommand(input);
        setInput('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  if (!open) return null;

  if (minimized) {
    return (
      <motion.div 
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-md cursor-pointer flex items-center shadow-lg z-50"
        onClick={() => setMinimized(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Terminal className="h-5 w-5 mr-2" />
        <span>Terminal</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-3/4 h-3/4 max-w-3xl"
        >
          <Card className="bg-gray-900 text-white border-gray-700 flex flex-col h-full shadow-2xl">
            <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between p-3">
              <CardTitle className="flex items-center text-white text-lg">
                <Terminal className="h-5 w-5 mr-2" />
                Royal Fortune Terminal
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => setMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-hidden">
              <div 
                ref={terminalRef}
                className="font-mono text-sm bg-black/90 w-full h-full rounded-md p-4 overflow-y-auto"
              >
                {output.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-3 border-t border-gray-700">
              <form onSubmit={handleSubmit} className="flex">
                <span className="text-green-400 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white"
                  placeholder="Tapez une commande..."
                  autoFocus
                />
              </form>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalConsole;
