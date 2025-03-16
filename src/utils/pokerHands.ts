
import { Suit as BaseSuit, Value as BaseValue } from '../components/Card';

export type Suit = BaseSuit;
export type Value = BaseValue;

export interface Card {
  suit: Suit;
  value: Value;
}

// Cache the value order for faster lookup
const valueOrder: Record<Value, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11,
  '10': 10, '9': 9, '8': 8, '7': 7,
  '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

// Creating a standard deck once to avoid recreating it each time
const standardDeck: Card[] = (() => {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  const values: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  
  return deck;
})();

// Optimized Fisher-Yates shuffle algorithm for better performance
export const createDeck = (): Card[] => {
  // Create a deep copy of the standard deck
  const deckCopy = JSON.parse(JSON.stringify(standardDeck));
  return shuffleDeck(deckCopy);
};

export const checkHand = (hand: Card[]) => {
  if (hand.length < 2) return { type: "Pas de combinaison", points: 0 };
  
  // Performance optimization - use Map instead of Record for counting
  const values = hand.map(card => valueOrder[card.value]);
  const suits = hand.map(card => card.suit);
  
  // Use a Map for more efficient value counting
  const valueCounts = new Map<number, number>();
  for (const val of values) {
    valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
  }
  
  // Vérification Flush (5 cartes minimum)
  const isFlush = hand.length >= 5 && new Set(suits).size === 1;
  
  // Cache sorted values for performance
  const sortedValues = [...values].sort((a, b) => a - b);
  
  // Vérification Quinte (5 cartes minimum)
  let isStraight = false;
  if (hand.length >= 5) {
    // Quick check - length matching and range check
    const min = sortedValues[0];
    const max = sortedValues[sortedValues.length - 1];
    
    if (max - min === sortedValues.length - 1 && new Set(sortedValues).size === sortedValues.length) {
      isStraight = true;
    }
  }

  // Convert Map values to array for quick checks
  const counts = Array.from(valueCounts.values());
  
  // Vérification des combinaisons
  const hasFourOfAKind = counts.includes(4);
  const hasThreeOfAKind = counts.includes(3);
  const pairCount = counts.filter(count => count === 2).length;

  // More balanced point calculation function
  const calculatePoints = (type: string) => {
    const baseValue = Math.max(...values);
    
    switch (type) {
      case "Quinte Flush": {
        const sum = sortedValues.reduce((a, b) => a + b, 0);
        // Reduced multiplier
        return sum * 10; 
      }
      case "Carré": {
        // Find the card value that appears 4 times
        let cardValue = 0;
        for (const [value, count] of valueCounts.entries()) {
          if (count === 4) {
            cardValue = value;
            break;
          }
        }
        // Reduced multiplier
        return cardValue * 4 * 8; 
      }
      case "Full": {
        // Find the values for three of a kind and pair
        let threeValue = 0;
        let pairValue = 0;
        
        for (const [value, count] of valueCounts.entries()) {
          if (count === 3) threeValue = value;
          else if (count === 2) pairValue = value;
        }
        
        // Reduced multiplier
        return (threeValue * 3 + pairValue * 2) * 6; 
      }
      case "Flush": {
        const sum = values.reduce((a, b) => a + b, 0);
        // Reduced multiplier
        return sum * 5; 
      }
      case "Quinte": {
        const sum = sortedValues.reduce((a, b) => a + b, 0);
        // Reduced multiplier
        return sum * 4;
      }
      case "Brelan": {
        // Find the card value that appears 3 times
        let cardValue = 0;
        for (const [value, count] of valueCounts.entries()) {
          if (count === 3) {
            cardValue = value;
            break;
          }
        }
        // Reduced multiplier
        return cardValue * 3 * 3;
      }
      case "Double Paire": {
        // Find the values of the two pairs
        const pairValues: number[] = [];
        for (const [value, count] of valueCounts.entries()) {
          if (count === 2) pairValues.push(value);
        }
        // Reduced multiplier
        return (pairValues[0] * 2 + pairValues[1] * 2) * 2;
      }
      case "Paire": {
        // Find the card value that appears 2 times
        let cardValue = 0;
        for (const [value, count] of valueCounts.entries()) {
          if (count === 2) {
            cardValue = value;
            break;
          }
        }
        // Reduced multiplier
        return cardValue * 2 * 1.5;
      }
      default:
        return baseValue;
    }
  };

  // Determine combination and calculate points
  if (isFlush && isStraight) return { type: "Quinte Flush", points: calculatePoints("Quinte Flush") };
  if (hasFourOfAKind) return { type: "Carré", points: calculatePoints("Carré") };
  if (hasThreeOfAKind && pairCount === 1) return { type: "Full", points: calculatePoints("Full") };
  if (isFlush) return { type: "Flush", points: calculatePoints("Flush") };
  if (isStraight) return { type: "Quinte", points: calculatePoints("Quinte") };
  if (hasThreeOfAKind) return { type: "Brelan", points: calculatePoints("Brelan") };
  if (pairCount === 2) return { type: "Double Paire", points: calculatePoints("Double Paire") };
  if (pairCount === 1) return { type: "Paire", points: calculatePoints("Paire") };
  
  return { type: "Carte Haute", points: calculatePoints("Carte Haute") };
};

const shuffleDeck = (deck: Card[]): Card[] => {
  // Use an optimized version of Fisher-Yates shuffle
  const length = deck.length;
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap more efficiently using destructuring
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export { shuffleDeck };
