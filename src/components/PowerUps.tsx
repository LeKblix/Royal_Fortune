
import React from 'react';
import { PowerUp } from '@/utils/pokerHands';
import { Button } from '@/components/ui/button';
import { 
  Zap,
  Plus,
  Shuffle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PowerUpsProps {
  powerUps: PowerUp[];
  onUsePowerUp: (type: PowerUp['type']) => void;
}

const PowerUps = ({ powerUps, onUsePowerUp }: PowerUpsProps) => {
  const getIcon = (type: PowerUp['type']) => {
    switch (type) {
      case 'doublePoints':
        return <Zap className="h-4 w-4" />;
      case 'extraCard':
        return <Plus className="h-4 w-4" />;
      case 'wildcard':
        return <Star className="h-4 w-4" />;
      case 'reroll':
        return <Shuffle className="h-4 w-4" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 space-y-2">
        {powerUps.map((powerUp, index) => (
          <motion.div
            key={powerUp.type}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onUsePowerUp(powerUp.type)}
                  disabled={powerUp.uses <= 0}
                  className={`
                    relative bg-indigo-500/10 hover:bg-indigo-500/20 
                    text-indigo-300 border border-indigo-500/20
                    ${powerUp.uses <= 0 ? 'opacity-50' : 'hover:scale-110 transition-transform'}
                  `}
                >
                  {getIcon(powerUp.type)}
                  {powerUp.uses > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full text-[10px] flex items-center justify-center text-black font-bold"
                    >
                      {powerUp.uses}
                    </motion.div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-gray-900/95 border-white/10 text-white"
                side="left"
                sideOffset={5}
              >
                <div className="space-y-1">
                  <p className="font-medium">{powerUp.label}</p>
                  <p className="text-gray-400 text-xs">{powerUp.description}</p>
                  <p className="text-indigo-300 text-xs">Utilisations: {powerUp.uses}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default PowerUps;
