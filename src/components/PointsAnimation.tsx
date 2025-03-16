
import React, { useEffect, memo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface PointsAnimationProps {
  points: number;
  combinationType: string;
  multiplier: number;
  show: boolean;
  selectedCards: Array<{ suit: string; value: string }>;
  onAnimationComplete?: () => void;
}

const cardVariants: Variants = {
  initial: { 
    y: 100, 
    opacity: 0, 
    rotateY: 0 
  },
  animate1: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.2
    }
  },
  animate2: { 
    rotateY: 360,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.4
    }
  },
  animate3: { 
    y: 100, 
    opacity: 0,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.2
    }
  }
};

const pointsVariants: Variants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.3
    }
  },
  exit: { 
    scale: 1.5,
    opacity: 0,
    transition: {
      duration: 0.3 
    }
  }
};

const PointsAnimation = memo(({ 
  points, 
  combinationType, 
  multiplier, 
  show, 
  selectedCards,
  onAnimationComplete 
}: PointsAnimationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 1600); // Slightly reduced for better UX
      
      return () => clearTimeout(timer);
    }
  }, [show, onAnimationComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm will-change-opacity"
          />
          
          <div className="relative flex gap-2 mb-8">
            {selectedCards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="initial"
                animate={["animate1", "animate2", "animate3"]}
                transition={{ 
                  delayChildren: index * 0.06,
                  staggerChildren: 0.08,
                }}
                className="w-20 h-32 bg-white rounded-lg shadow-xl flex items-center justify-center text-2xl will-change-transform"
              >
                <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}>
                  {card.value}{card.suit}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={pointsVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center will-change-transform"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {combinationType}
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                delay: 0.1
              }}
              className="flex items-center justify-center gap-3 text-2xl"
            >
              <span className="text-white">{points}</span>
              <span className="text-white">×</span>
              <span className="text-amber-400">{multiplier.toFixed(2)}</span>
              <span className="text-white">=</span>
              <motion.span 
                className="text-3xl font-bold text-amber-400"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.1 }}
                transition={{ 
                  duration: 0.2, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  repeat: 1,
                  repeatType: "reverse"
                }}
              >
                {Math.floor(points * multiplier)}
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

PointsAnimation.displayName = 'PointsAnimation';

export default PointsAnimation;
