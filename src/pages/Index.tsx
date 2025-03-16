import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '../components/Card';
import { createDeck, checkHand, type Card as CardType } from '../utils/pokerHands';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ObjectiveDialog from '@/components/ObjectiveDialog';
import { Trophy, RefreshCw, Trash2, HandMetal, Shuffle, Terminal } from 'lucide-react';
import PointsAnimation from '../components/PointsAnimation';
import RulesDialog from '../components/RulesDialog';
import StartMenu from '@/components/StartMenu';
import GameOverScreen from '@/components/GameOverScreen';
import HandHistory from '@/components/HandHistory';
import Leaderboard from '@/components/Leaderboard';
import TerminalConsole from '@/components/TerminalConsole';
import { loadScores, saveScore, getPlayerName, savePlayerName } from '@/utils/leaderboardService';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundMusic from '../components/BackgroundMusic';

interface AnimationData {
  points: number;
  combinationType: string;
  multiplier: number;
  selectedCards: Array<{ suit: string; value: string }>;
}

const OBJECTIVES = [
  150,      // Niveau 1
  450,      // Niveau 2
  1000,     // Niveau 3
  2000,     // Niveau 4
  3500,     // Niveau 5
  5500,     // Niveau 6
  8000,     // Niveau 7
  11000,    // Niveau 8
  15000,    // Niveau 9
  20000     // Niveau 10
];

const Index = () => {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [hand, setHand] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<boolean[]>([]);
  const [score, setScore] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [objective, setObjective] = useState<number>(OBJECTIVES[0]);
  const [remainingHands, setRemainingHands] = useState<number>(5);
  const [discardCount, setDiscardCount] = useState<number>(3);
  const [showObjectiveDialog, setShowObjectiveDialog] = useState(false);
  const [pointMultipliers, setPointMultipliers] = useState({
    pair: 1,
    brelan: 1,
    straight: 1,
    flush: 1,
    full: 1,
    carre: 1,
    straightFlush: 1,
    doublePaire: 1
  });
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [animationData, setAnimationData] = useState<AnimationData>({
    points: 0,
    combinationType: '',
    multiplier: 1,
    selectedCards: []
  });
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [leaderboardScores, setLeaderboardScores] = useState(loadScores());
  const { toast } = useToast();
  const [combo, setCombo] = useState<number>(0);
  const [handHistory, setHandHistory] = useState<Array<{
    cards: CardType[];
    points: number;
    type: string;
  }>>([]);

  useEffect(() => {
    setLeaderboardScores(loadScores());
  }, []);

  const endGame = useCallback(() => {
    setShowGameOver(true);
  }, []);

  const newGame = useCallback(() => {
    const newDeck = createDeck();
    setDeck(newDeck);
    const newHand = newDeck.slice(0, 8);
    setHand(newHand);
    setSelectedCards(new Array(8).fill(false));
    setScore(0);
    setCurrentLevel(0);
    setObjective(OBJECTIVES[0]);
    setRemainingHands(5);
    setDiscardCount(3);
    setPointMultipliers({
      pair: 1,
      brelan: 1,
      straight: 1,
      flush: 1,
      full: 1,
      carre: 1,
      straightFlush: 1,
      doublePaire: 1
    });
    setHandHistory([]);
    setCombo(0);
  }, []);

  const toggleCardSelection = useCallback((index: number) => {
    setSelectedCards(prev => {
      const newSelection = [...prev];
      newSelection[index] = !newSelection[index];
      return newSelection;
    });
  }, []);

  const ensureDeckHasCards = useCallback((needed: number): CardType[] => {
    if (deck.length >= needed) {
      return [...deck];
    }
    
    return createDeck();
  }, [deck]);

  const discardCard = (index: number) => {
    if (discardCount <= 0) {
      toast({
        title: "Erreur",
        description: "Vous n'avez plus de défausses disponibles !",
        variant: "destructive",
      });
      return;
    }

    const newHand = [...hand];
    const currentDeck = ensureDeckHasCards(1);
    const newCard = currentDeck[0];
    const newDeck = currentDeck.slice(1);

    newHand[index] = newCard;
    setHand(newHand);
    setDeck(newDeck);
    setDiscardCount(prev => prev - 1);

    toast({
      title: "Carte défaussée",
      description: `Il vous reste ${discardCount - 1} défausses`,
    });
  };

  const discardSelectedCards = useCallback(() => {
    const selectedIndices = selectedCards
      .map((isSelected, index) => isSelected ? index : -1)
      .filter(index => index !== -1);
  
    const selectedCount = selectedIndices.length;
  
    if (selectedCount === 0) {
      toast({
        title: "Erreur",
        description: "Sélectionnez des cartes à défausser !",
        variant: "destructive",
      });
      return;
    }

    if (selectedCount > 5) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez défausser que 5 cartes maximum à la fois !",
        variant: "destructive",
      });
      return;
    }

    if (discardCount <= 0) {
      toast({
        title: "Erreur",
        description: "Vous n'avez plus de défausses disponibles !",
        variant: "destructive",
      });
      return;
    }

    const currentDeck = ensureDeckHasCards(selectedCount);
    
    const newHand = [...hand];
    
    selectedIndices.forEach((handIndex, i) => {
      if (i < currentDeck.length) {
        newHand[handIndex] = currentDeck[i];
      }
    });

    setHand(newHand);
    setDeck(currentDeck.slice(selectedCount));
    setDiscardCount(prev => prev - 1);
    setSelectedCards(new Array(8).fill(false));

    toast({
      title: "Cartes défaussées",
      description: `Il vous reste ${discardCount - 1} défausses`,
    });
  }, [selectedCards, hand, discardCount, ensureDeckHasCards, toast]);

  const playSelectedCards = useCallback(() => {
    const selectedCardsList = hand.filter((_, index) => selectedCards[index]);
    
    if (selectedCardsList.length === 0) {
      toast({
        title: "Erreur",
        description: "Sélectionnez des cartes à jouer !",
        variant: "destructive",
      });
      return;
    }

    const result = checkHand(selectedCardsList);
    
    let finalPoints = result.points;
    let appliedMultiplier = 1;

    if (handHistory.length > 0 && result.type === handHistory[handHistory.length - 1]?.type) {
      setCombo(prev => prev + 1);
      finalPoints *= (1 + combo * 0.5);
    } else {
      setCombo(0);
    }

    switch (result.type) {
      case "Paire":
        appliedMultiplier = pointMultipliers.pair;
        finalPoints *= appliedMultiplier;
        break;
      case "Double Paire":
        appliedMultiplier = pointMultipliers.doublePaire || 1;
        finalPoints *= appliedMultiplier;
        break;
      case "Brelan":
        appliedMultiplier = pointMultipliers.brelan;
        finalPoints *= appliedMultiplier;
        break;
      case "Quinte":
        appliedMultiplier = pointMultipliers.straight;
        finalPoints *= appliedMultiplier;
        break;
      case "Flush":
        appliedMultiplier = pointMultipliers.flush || 1;
        finalPoints *= appliedMultiplier;
        break;
      case "Full":
        appliedMultiplier = pointMultipliers.full || 1;
        finalPoints *= appliedMultiplier;
        break;
      case "Carré":
        appliedMultiplier = pointMultipliers.carre || 1;
        finalPoints *= appliedMultiplier;
        break;
      case "Quinte Flush":
        appliedMultiplier = pointMultipliers.straightFlush || 1;
        finalPoints *= appliedMultiplier;
        break;
    }

    setHandHistory(prev => [...prev, {
      cards: selectedCardsList,
      points: Math.floor(finalPoints),
      type: result.type
    }]);

    if (finalPoints > 0) {
      setAnimationData({
        points: result.points,
        combinationType: result.type,
        multiplier: appliedMultiplier,
        selectedCards: selectedCardsList
      });
      
      setShowPointsAnimation(true);
      
      const selectedIndices = selectedCards
        .map((isSelected, index) => isSelected ? index : -1)
        .filter(index => index !== -1);

      const newHand = [...hand];
      
      const cardsNeeded = selectedIndices.length;
      const currentDeck = ensureDeckHasCards(cardsNeeded);
      
      let deckIndex = 0;
      selectedIndices.forEach(handIndex => {
        if (deckIndex < currentDeck.length) {
          newHand[handIndex] = currentDeck[deckIndex];
          deckIndex++;
        }
      });
      
      setDeck(currentDeck.slice(deckIndex));

      setTimeout(() => {
        const newScore = score + Math.floor(finalPoints);
        setScore(newScore);
        setRemainingHands(prev => prev - 1);
      
        if (newScore >= objective) {
          if (currentLevel < OBJECTIVES.length - 1) {
            setCurrentLevel(prev => prev + 1);
            setObjective(OBJECTIVES[currentLevel + 1]);
            setShowObjectiveDialog(true);
            setRemainingHands(5);
            setDiscardCount(3);
            toast({
              title: "Niveau Complété !",
              description: `Vous passez au niveau ${currentLevel + 2} ! Défausses réinitialisées.`,
            });
          } else {
            endGame();
            return;
          }
        } else if (remainingHands <= 1) {
          endGame();
          return;
        }
      
        setHand(newHand);
        setSelectedCards(new Array(8).fill(false));
      }, 1600);
    } else {
      toast({
        title: "Pas de combinaison",
        description: "Essayez une autre sélection de cartes.",
        variant: "destructive",
      });
    }
  }, [hand, selectedCards, handHistory, combo, objective, currentLevel, score, remainingHands, discardCount, ensureDeckHasCards, toast, endGame]);

  const handleUpgrade = (type: string) => {
    switch (type) {
      case 'multiply':
        setPointMultipliers(prev => ({ ...prev, pair: prev.pair * 1.5 }));
        break;
      case 'brelan':
        setPointMultipliers(prev => ({ ...prev, brelan: prev.brelan * 1.5 }));
        break;
      case 'straight':
        setPointMultipliers(prev => ({ ...prev, straight: prev.straight * 1.5 }));
        break;
      case 'flush':
        setPointMultipliers(prev => ({ ...prev, flush: (prev.flush || 1) * 1.5 }));
        break;
      case 'full':
        setPointMultipliers(prev => ({ ...prev, full: (prev.full || 1) * 2 }));
        break;
      case 'carre':
        setPointMultipliers(prev => ({ ...prev, carre: (prev.carre || 1) * 2 }));
        break;
      case 'straightFlush':
        setPointMultipliers(prev => ({ ...prev, straightFlush: (prev.straightFlush || 1) * 2 }));
        break;
      case 'doublePaire':
        setPointMultipliers(prev => ({ ...prev, doublePaire: (prev.doublePaire || 1) * 1.5 }));
        break;
    }
    setShowObjectiveDialog(false);
  };

  const handleSaveScore = (playerName: string) => {
    saveScore(playerName, score, currentLevel + 1);
    setLeaderboardScores(loadScores());
    setShowLeaderboard(false);
  };

  const handleShowLeaderboard = () => {
    setLeaderboardScores(loadScores());
    setShowLeaderboard(true);
  };

  const handleStartGame = useCallback((playerName: string) => {
    savePlayerName(playerName);
    setShowStartMenu(false);
    newGame();
  }, [newGame]);

  const handleBackToMenu = useCallback(() => {
    setShowGameOver(false);
    setShowStartMenu(true);
  }, []);

  const handleNewGame = useCallback(() => {
    setShowStartMenu(true);
  }, []);

  if (showStartMenu) {
    return (
      <AnimatePresence>
        <motion.div
          key="start-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StartMenu 
            onStartGame={handleStartGame} 
            onShowLeaderboard={handleShowLeaderboard} 
          />
          <Leaderboard
            open={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
            scores={leaderboardScores}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="game-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 p-6 overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto h-screen flex flex-col">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <UICard className="bg-gray-900/40 backdrop-blur-md border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-white/5 bg-black/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-amber-300" />
                      <span className="text-xl font-bold text-white/90">
                        Royal Fortune
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-black/20 border-white/10 text-white/70 hover:text-white hover:bg-black/30"
                        onClick={() => setShowTerminal(true)}
                      >
                        <Terminal className="h-4 w-4" />
                      </Button>
                      <RulesDialog />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                      <p className="text-xs text-gray-400 mb-1">Niveau</p>
                      <p className="text-2xl font-bold text-amber-300">{currentLevel + 1}</p>
                    </div>
                    <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                      <p className="text-xs text-gray-400 mb-1">Score</p>
                      <p className="text-2xl font-bold text-white/90">{score}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                    <div className="flex justify-between items-baseline">
                      <p className="text-xs text-gray-400">Objectif</p>
                      <p className="text-xl font-bold text-amber-300">{objective}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                      <div className="flex items-center gap-2">
                        <HandMetal className="h-4 w-4 text-amber-300" />
                        <div>
                          <p className="text-xs text-gray-400">Mains</p>
                          <p className="text-xl font-bold text-white/90">{remainingHands}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-black/20 p-3 border border-white/5">
                      <div className="flex items-center gap-2">
                        <Shuffle className="h-4 w-4 text-amber-300" />
                        <div>
                          <p className="text-xs text-gray-400">Défausses</p>
                          <p className="text-xl font-bold text-white/90">{discardCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 font-medium">Multiplicateurs</p>
                    <div className="grid grid-cols-2 gap-2">
                      {pointMultipliers.pair > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">Paire</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.pair.toFixed(1)}</span>
                        </div>
                      )}
                      {pointMultipliers.doublePaire > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">2 Paires</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.doublePaire.toFixed(1)}</span>
                        </div>
                      )}
                      {pointMultipliers.brelan > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">Brelan</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.brelan.toFixed(1)}</span>
                        </div>
                      )}
                      {pointMultipliers.straight > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">Quinte</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.straight.toFixed(1)}</span>
                        </div>
                      )}
                      {pointMultipliers.flush > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">Couleur</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.flush.toFixed(1)}</span>
                        </div>
                      )}
                      {pointMultipliers.full > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">Full</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.full.toFixed(1)}</span>
                        </div>
                      )}
                      {pointMultipliers.carre > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">Carré</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.carre.toFixed(1)}</span>
                        </div>
                      )}
                      {pointMultipliers.straightFlush > 1 && (
                        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
                          <span className="text-sm text-gray-300">Q.Flush</span>
                          <span className="float-right text-amber-300 font-bold">×{pointMultipliers.straightFlush.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </UICard>
            </div>

            <div className="col-span-9 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleNewGame}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium px-6 py-2 rounded-lg shadow-lg transition-all"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Nouvelle Partie
                  </Button>
                  <Button 
                    onClick={discardSelectedCards}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-medium px-6 py-2 rounded-lg shadow-lg transition-all"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Défausser ({discardCount})
                  </Button>
                </div>
                <Button 
                  onClick={playSelectedCards}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-medium px-8 py-2 rounded-lg shadow-lg transition-all"
                >
                  <HandMetal className="h-5 w-5 mr-2" />
                  Jouer la Sélection
                </Button>
              </div>

              <UICard className="bg-gray-900/40 backdrop-blur-md border-white/5 shadow-2xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-8 gap-6">
                    {hand.map((card, index) => (
                      <motion.div 
                        key={`${card.suit}-${card.value}-${index}`} 
                        className="relative group transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 260,
                          damping: 20
                        }}
                      >
                        <Card
                          suit={card.suit}
                          value={card.value}
                          index={index}
                          isSelected={selectedCards[index]}
                          onClick={() => toggleCardSelection(index)}
                        />
                        {selectedCards[index] && (
                          <Badge 
                            className="absolute -top-3 -right-3 bg-amber-300/90 text-black font-bold animate-bounce shadow-xl"
                          >
                            ✓
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </UICard>
            </div>
          </div>
        </div>

        {showGameOver && (
          <GameOverScreen
            score={score}
            level={currentLevel + 1}
            onBackToMenu={handleBackToMenu}
            onSaveScore={() => setShowLeaderboard(true)}
          />
        )}

        <Leaderboard
          open={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          scores={leaderboardScores}
          currentScore={showGameOver ? score : undefined}
          currentLevel={showGameOver ? currentLevel + 1 : undefined}
          onSaveScore={handleSaveScore}
        />

        <HandHistory history={handHistory} />
        
        {combo > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 bg-amber-300/90 text-black font-bold px-4 py-2 rounded-full"
          >
            Combo x{combo + 1}
          </motion.div>
        )}

        <ObjectiveDialog
          open={showObjectiveDialog}
          onClose={() => setShowObjectiveDialog(false)}
          onUpgrade={handleUpgrade}
        />

        <PointsAnimation
          points={animationData.points}
          combinationType={animationData.combinationType}
          multiplier={animationData.multiplier}
          selectedCards={hand.filter((_, index) => selectedCards[index])}
          show={showPointsAnimation}
          onAnimationComplete={() => setShowPointsAnimation(false)}
        />

        <TerminalConsole 
          open={showTerminal} 
          onClose={() => setShowTerminal(false)} 
        />
        
        <BackgroundMusic />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
