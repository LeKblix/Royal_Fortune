
import React, { memo } from 'react';
import { motion } from 'framer-motion';

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface CardProps {
  suit: Suit;
  value: Value;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const Card = memo(({ suit, value, index, isSelected, onClick }: CardProps) => {
  const isRed = suit === '♥' || suit === '♦';
  
  return (
    <motion.div
      onClick={onClick}
      className={`
        relative w-24 h-36 bg-white rounded-lg shadow-lg cursor-pointer
        ${isSelected ? 'ring-4 ring-amber-400/80 shadow-amber-400/40 shadow-xl' : ''}
      `}
      layout
      layoutId={`card-${suit}-${value}-${index}`}
      whileHover={{ 
        y: -10, 
        scale: 1.05,
        boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
        transition: { 
          type: "spring", 
          stiffness: 500, 
          damping: 30
        }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30,
          delay: index * 0.05
        }
      }}
      style={{ 
        willChange: "transform, opacity"
      }}
    >
      <div className={`absolute top-2 left-2 text-xl font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
        {value}
      </div>
      <div className={`absolute top-6 left-2 text-3xl ${isRed ? 'text-red-600' : 'text-black'}`}>
        {suit}
      </div>
      <div className={`absolute bottom-2 right-2 text-xl font-bold rotate-180 ${isRed ? 'text-red-600' : 'text-black'}`}>
        {value}
      </div>
      <div className={`absolute bottom-6 right-2 text-3xl rotate-180 ${isRed ? 'text-red-600' : 'text-black'}`}>
        {suit}
      </div>
      
      {isSelected && (
        <motion.div 
          className="absolute inset-0 bg-amber-400/20 rounded-lg" 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0.5, 1], 
            scale: [0.95, 1.02, 1]
          }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            times: [0, 0.3, 0.6, 1]
          }}
        />
      )}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;
