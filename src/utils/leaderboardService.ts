
import { PlayerScore } from '@/components/Leaderboard';

// Load scores from localStorage
export const loadScores = (): PlayerScore[] => {
  try {
    const scoresJson = localStorage.getItem('royalFortuneScores');
    if (scoresJson) {
      return JSON.parse(scoresJson);
    }
  } catch (error) {
    console.error('Error loading scores:', error);
  }
  return [];
};

// Save a new score
export const saveScore = (playerName: string, score: number, level: number): PlayerScore => {
  try {
    const scores = loadScores();
    
    const newScore: PlayerScore = {
      id: Date.now().toString(),
      playerName: playerName.trim() || 'Anonyme', // Fallback to 'Anonyme' if no name provided
      score,
      level,
      date: new Date().toISOString()
    };
    
    scores.push(newScore);
    
    // Sort and limit to top 100 scores to prevent localStorage overflow
    const sortedScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
    
    localStorage.setItem('royalFortuneScores', JSON.stringify(sortedScores));
    return newScore;
  } catch (error) {
    console.error('Error saving score:', error);
    return {
      id: Date.now().toString(),
      playerName: playerName || 'Anonyme',
      score,
      level,
      date: new Date().toISOString()
    };
  }
};

// Get a player name from localStorage or prompt the user
export const getPlayerName = (): string => {
  try {
    // Try to get the player name from localStorage
    const savedName = localStorage.getItem('royalFortunePlayerName');
    if (savedName) {
      return savedName;
    }
  } catch (error) {
    console.error('Error getting player name:', error);
  }
  
  // If no name in localStorage, return empty string
  // The UI will handle prompting the user
  return '';
};

// Save player name to localStorage
export const savePlayerName = (name: string): void => {
  try {
    localStorage.setItem('royalFortunePlayerName', name.trim());
  } catch (error) {
    console.error('Error saving player name:', error);
  }
};

// Get the top N scores
export const getTopScores = (limit = 10): PlayerScore[] => {
  const scores = loadScores();
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Check if the given score would be in the top N
export const isHighScore = (score: number, limit = 10): boolean => {
  const scores = loadScores();
  if (scores.length < limit) return true;
  
  const lowestTopScore = [...scores]
    .sort((a, b) => b.score - a.score)
    [Math.min(limit - 1, scores.length - 1)];
  
  return score > (lowestTopScore?.score || 0);
};
