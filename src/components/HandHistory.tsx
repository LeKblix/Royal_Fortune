
import React from 'react';
import { Card } from '@/utils/pokerHands';
import { motion } from 'framer-motion';

interface HandHistoryProps {
  history: Array<{
    cards: Card[];
    points: number;
    type: string;
  }>;
}

const HandHistory = ({ history }: HandHistoryProps) => {
  return (
    <div className="fixed bottom-4 left-4 max-w-sm">
      <div className="bg-gray-900/40 backdrop-blur-md rounded-xl border border-white/5 p-4 shadow-xl">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Historique</h3>
        <div className="space-y-2">
          {history.slice(-3).map((hand, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={idx}
              className="flex items-center justify-between bg-black/20 rounded-lg p-2 text-sm"
            >
              <div className="flex gap-1">
                {hand.cards.map((card, cardIdx) => (
                  <span
                    key={cardIdx}
                    className={`${
                      card.suit === '♥' || card.suit === '♦' ? 'text-rose-400' : 'text-white/90'
                    }`}
                  >
                    {card.value}{card.suit}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{hand.type}</span>
                <span className="text-amber-300 font-bold">+{hand.points}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandHistory;
