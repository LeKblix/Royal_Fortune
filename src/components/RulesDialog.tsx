
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

const RulesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20">
          <Info className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Règles du jeu et système de points</DialogTitle>
          <DialogDescription>
            Apprenez à jouer et à maximiser vos points
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="rules" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules">Règles du jeu</TabsTrigger>
            <TabsTrigger value="points">Système de points</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold">Comment jouer</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Vous avez 8 cartes en main</li>
                <li>Sélectionnez les cartes que vous voulez jouer pour former une combinaison</li>
                <li>Vous pouvez défausser des cartes (3 fois maximum) pour en piocher de nouvelles</li>
                <li>Vous avez 5 mains à jouer pour atteindre l'objectif de points du niveau</li>
                <li>Complétez les objectifs pour débloquer de nouveaux multiplicateurs</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="points" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold">Calcul des points</h3>
              <p>Les points sont calculés selon la formule : Points de base × Multiplicateur de combinaison × Multiplicateur de niveau</p>
              
              <h4 className="font-semibold mt-4">Points de base par combinaison</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-medium">Quinte Flush :</span> Somme des cartes × 10</li>
                <li><span className="font-medium">Carré :</span> Valeur du carré × 4 × 8</li>
                <li><span className="font-medium">Full :</span> (Valeur du brelan × 3 + Valeur de la paire × 2) × 5</li>
                <li><span className="font-medium">Flush :</span> Somme des cartes × 6</li>
                <li><span className="font-medium">Quinte :</span> Somme des cartes × 4</li>
                <li><span className="font-medium">Brelan :</span> Valeur du brelan × 3 × 3</li>
                <li><span className="font-medium">Double Paire :</span> Somme des paires × 2</li>
                <li><span className="font-medium">Paire :</span> Valeur de la paire × 2 × 2</li>
              </ul>
              
              <h4 className="font-semibold mt-4">Valeur des cartes</h4>
              <p>As = 14, Roi = 13, Dame = 12, Valet = 11, 10 à 2 = valeur nominale</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;
