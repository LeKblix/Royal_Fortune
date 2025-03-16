
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
import { BookOpen } from "lucide-react";

const RulesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20">
          <BookOpen className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Règles du jeu et système de points</DialogTitle>
          <DialogDescription>
            Apprenez à jouer et à maximiser vos points
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="rules" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Règles du jeu</TabsTrigger>
            <TabsTrigger value="points">Système de points</TabsTrigger>
            <TabsTrigger value="strategies">Stratégies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold">Objectif</h3>
              <p>Le but est d'atteindre les objectifs de points à chaque niveau en créant les meilleures combinaisons de cartes possibles.</p>
              
              <h3 className="text-lg font-bold mt-4">Déroulement</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <span className="font-medium">Début de partie</span>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Vous commencez avec 8 cartes en main</li>
                    <li>5 mains à jouer par niveau</li>
                    <li>3 défausses disponibles</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Actions possibles</span>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Sélectionner des cartes pour former une combinaison</li>
                    <li>Défausser des cartes non désirées (maximum 3 fois)</li>
                    <li>Jouer une combinaison</li>
                  </ul>
                </li>
              </ol>
              
              <h3 className="text-lg font-bold mt-4">Système de Combo</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Les combinaisons identiques consécutives forment un combo</li>
                <li>Chaque combo augmente les points de 50%</li>
              </ul>
              
              <h3 className="text-lg font-bold mt-4">Niveaux et Progression</h3>
              <p className="mb-2">Structure des niveaux:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>10 niveaux de difficulté croissante</li>
                <li>Objectifs de points progressifs</li>
                <li>Multiplicateurs débloquables à chaque niveau</li>
              </ul>
              
              <p className="mt-3 mb-2">Objectifs par niveau:</p>
              <ul className="list-disc pl-5 grid grid-cols-2 gap-x-2 gap-y-1">
                <li>Niveau 1: 150 points</li>
                <li>Niveau 2: 450 points</li>
                <li>Niveau 3: 1000 points</li>
                <li>Niveau 4: 2000 points</li>
                <li>Niveau 5: 3500 points</li>
                <li>Niveau 6: 5500 points</li>
                <li>Niveau 7: 8000 points</li>
                <li>Niveau 8: 11000 points</li>
                <li>Niveau 9: 15000 points</li>
                <li>Niveau 10: 20000 points</li>
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
              
              <h4 className="font-semibold mt-4">Système de Combo</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Première combinaison: points normaux</li>
                <li>Deuxième combinaison identique consécutive: ×1.5</li>
                <li>Troisième combinaison identique consécutive: ×2</li>
                <li>Et ainsi de suite (+0.5 par combinaison)</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold">Astuces Stratégiques</h3>
              
              <h4 className="font-semibold mt-3">Gestion des Défausses</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gardez au moins une défausse pour les situations critiques</li>
                <li>Privilégiez les cartes hautes lors des défausses</li>
                <li>N'hésitez pas à défausser plusieurs cartes à la fois si nécessaire</li>
              </ul>
              
              <h4 className="font-semibold mt-4">Optimisation des Points</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Visez les combos pour multiplier vos points</li>
                <li>Concentrez-vous sur les combinaisons fortes en début de niveau</li>
                <li>Adaptez votre stratégie en fonction des multiplicateurs débloqués</li>
                <li>Une Quinte Flush avec des cartes hautes rapporte beaucoup de points</li>
              </ul>
              
              <h4 className="font-semibold mt-4">Progression</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Choisissez les multiplicateurs en fonction de votre style de jeu</li>
                <li>Planifiez vos coups sur plusieurs mains</li>
                <li>N'ayez pas peur de sacrifier une main pour préparer un combo</li>
                <li>Débloquez les multiplicateurs pour les combinaisons que vous formez le plus souvent</li>
              </ul>
              
              <h4 className="font-semibold mt-4">Mode Terminal</h4>
              <p>Une version simplifiée jouable dans le terminal pour les puristes :</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Assurez-vous d'avoir Node.js installé</li>
                <li>Naviguez jusqu'au dossier du projet</li>
                <li>Exécutez : <code className="bg-gray-800 px-2 py-1 rounded text-xs">node src/terminal/royalFortune.js</code></li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;
