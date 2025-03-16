
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ObjectiveDialogProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: (type: string) => void;
}

const ObjectiveDialog = ({ open, onClose, onUpgrade }: ObjectiveDialogProps) => {
  const [upgrades] = React.useState([
    { type: 'multiply', label: 'Multiplicateur ×1.5 pour les paires' },
    { type: 'brelan', label: 'Multiplicateur ×1.5 pour les brelans' },
    { type: 'straight', label: 'Multiplicateur ×1.5 pour les quintes' },
    { type: 'flush', label: 'Multiplicateur ×1.5 pour les couleurs' },
    { type: 'full', label: 'Multiplicateur ×2 pour les full' },
    { type: 'carre', label: 'Multiplicateur ×2 pour les carrés' },
    { type: 'straightFlush', label: 'Multiplicateur ×2 pour les quintes flush' },
    { type: 'doublePaire', label: 'Multiplicateur ×1.5 pour les doubles paires' },
  ]);

  const [availableUpgrades, setAvailableUpgrades] = React.useState<typeof upgrades>([]);

  React.useEffect(() => {
    if (open) {
      // Mélanger les améliorations et en prendre 3 aléatoirement
      const shuffled = [...upgrades].sort(() => Math.random() - 0.5);
      setAvailableUpgrades(shuffled.slice(0, 3));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Objectif Atteint !</DialogTitle>
          <DialogDescription>
            Choisissez une amélioration pour votre système de points
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {availableUpgrades.map((upgrade) => (
            <Button 
              key={upgrade.type}
              onClick={() => onUpgrade(upgrade.type)} 
              className="w-full"
            >
              {upgrade.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectiveDialog;
