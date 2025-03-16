
#!/usr/bin/env node

const readline = require('readline');

// Configuration du terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Constantes du jeu
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const OBJECTIVES = [150, 500, 1500, 3000, 7500, 12000, 20000, 30000, 40000, 50000];

// Classe principale du jeu
class RoyalFortune {
  constructor() {
    this.deck = [];
    this.hand = [];
    this.selectedCards = [];
    this.score = 0;
    this.currentLevel = 0;
    this.objective = OBJECTIVES[0];
    this.remainingHands = 5;
    this.discardCount = 3;
    this.combo = 0;
    this.lastCombination = "";
    this.handHistory = [];
    this.scores = this.loadScores();
    this.playerName = "";
  }

  // Initialiser une nouvelle partie
  newGame() {
    this.createDeck();
    this.shuffleDeck();
    this.hand = this.deck.splice(0, 8);
    this.selectedCards = [];
    this.score = 0;
    this.currentLevel = 0;
    this.objective = OBJECTIVES[0];
    this.remainingHands = 5;
    this.discardCount = 3;
    this.combo = 0;
    this.lastCombination = "";
    this.handHistory = [];
    console.clear();
    this.displayWelcomeScreen();
  }

  // Créer un jeu de cartes avec 2 jokers
  createDeck() {
    this.deck = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        this.deck.push({ suit, value });
      }
    }
    // Ajouter 2 jokers
    this.deck.push({ suit: '🃏', value: 'JOKER', isSpecial: true });
    this.deck.push({ suit: '🃏', value: 'JOKER', isSpecial: true });
  }

  // Mélanger le jeu de cartes
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  // Convertir une valeur de carte en nombre pour comparer
  getValueRank(value) {
    const valueOrder = {
      'JOKER': 15, 'A': 14, 'K': 13, 'Q': 12, 'J': 11,
      '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, 
      '5': 5, '4': 4, '3': 3, '2': 2
    };
    return valueOrder[value] || 0;
  }

  // Vérifier la combinaison des cartes sélectionnées
  checkHand(hand) {
    if (hand.length < 2) return { type: "Pas de combinaison", points: 0 };
    
    const values = hand.map(card => this.getValueRank(card.value));
    const suits = hand.map(card => card.suit);
    
    // Comptage des valeurs
    const valueCounts = {};
    values.forEach(val => {
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    });
    
    // Vérification Flush (5 cartes minimum de même couleur)
    const isFlush = hand.length >= 5 && suits.every(suit => suit === suits[0]);
    
    // Vérification Quinte (5 cartes minimum en séquence)
    const sortedValues = [...values].sort((a, b) => a - b);
    const isStraight = hand.length >= 5 && sortedValues.every((val, i) => 
      i === 0 || val === sortedValues[i - 1] + 1
    );

    // Vérification des combinaisons
    const counts = Object.values(valueCounts);
    const hasFourOfAKind = counts.includes(4);
    const hasThreeOfAKind = counts.includes(3);
    const pairCount = counts.filter(count => count === 2).length;

    // Calcul des points en fonction des combinaisons
    const calculatePoints = (type) => {
      const baseValue = Math.max(...values);
      switch (type) {
        case "Quinte Flush": {
          const sum = sortedValues.reduce((a, b) => a + b, 0);
          return sum * 25;
        }
        case "Carré": {
          const cardValue = Number(Object.entries(valueCounts).find(([_, count]) => count === 4)?.[0]);
          return cardValue * 4 * 20;
        }
        case "Full": {
          const threeValue = Number(Object.entries(valueCounts).find(([_, count]) => count === 3)?.[0]);
          const pairValue = Number(Object.entries(valueCounts).find(([_, count]) => count === 2)?.[0]);
          return (threeValue * 3 + pairValue * 2) * 15;
        }
        case "Flush": {
          const sum = values.reduce((a, b) => a + b, 0);
          return sum * 15;
        }
        case "Quinte": {
          const sum = sortedValues.reduce((a, b) => a + b, 0);
          return sum * 10;
        }
        case "Brelan": {
          const cardValue = Number(Object.entries(valueCounts).find(([_, count]) => count === 3)?.[0]);
          return cardValue * 3 * 8;
        }
        case "Double Paire": {
          const pairValues = Object.entries(valueCounts)
            .filter(([_, count]) => count === 2)
            .map(([value, _]) => Number(value));
          return (pairValues[0] * 2 + pairValues[1] * 2) * 6;
        }
        case "Paire": {
          const cardValue = Number(Object.entries(valueCounts).find(([_, count]) => count === 2)?.[0]);
          return cardValue * 2 * 4;
        }
        default:
          return baseValue;
      }
    };

    if (isFlush && isStraight) return { type: "Quinte Flush", points: calculatePoints("Quinte Flush") };
    if (hasFourOfAKind) return { type: "Carré", points: calculatePoints("Carré") };
    if (hasThreeOfAKind && pairCount === 1) return { type: "Full", points: calculatePoints("Full") };
    if (isFlush) return { type: "Flush", points: calculatePoints("Flush") };
    if (isStraight) return { type: "Quinte", points: calculatePoints("Quinte") };
    if (hasThreeOfAKind) return { type: "Brelan", points: calculatePoints("Brelan") };
    if (pairCount === 2) return { type: "Double Paire", points: calculatePoints("Double Paire") };
    if (pairCount === 1) return { type: "Paire", points: calculatePoints("Paire") };
    
    return { type: "Carte Haute", points: calculatePoints("Carte Haute") };
  }

  // Afficher l'écran d'accueil
  displayWelcomeScreen() {
    console.clear();
    console.log("\n\n\n");
    console.log("  ██████╗  ██████╗ ██╗   ██╗ █████╗ ██╗         ███████╗ ██████╗ ██████╗ ████████╗██╗   ██╗███╗   ██╗███████╗");
    console.log("  ██╔══██╗██╔═══██╗╚██╗ ██╔╝██╔══██╗██║         ██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██║   ██║████╗  ██║██╔════╝");
    console.log("  ██████╔╝██║   ██║ ╚████╔╝ ███████║██║         █████╗  ██║   ██║██████╔╝   ██║   ██║   ██║██╔██╗ ██║█████╗  ");
    console.log("  ██╔══██╗██║   ██║  ╚██╔╝  ██╔══██║██║         ██╔══╝  ██║   ██║██╔══██╗   ██║   ██║   ██║██║╚██╗██║██╔══╝  ");
    console.log("  ██║  ██║╚██████╔╝   ██║   ██║  ██║███████╗    ██║     ╚██████╔╝██║  ██║   ██║   ╚██████╔╝██║ ╚████║███████╗");
    console.log("  ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝");
    console.log("\n                                   Le poker revisité - Version Terminal\n\n");
    console.log("  1. Jouer");
    console.log("  2. Voir les Meilleurs Scores");
    console.log("  3. Quitter");
    console.log("\n  Faites votre choix (1-3): ");
    
    rl.question("", (choice) => {
      switch (choice) {
        case "1":
          this.askPlayerName();
          break;
        case "2":
          this.displayLeaderboard();
          break;
        case "3":
          console.log("\n  Au revoir !");
          rl.close();
          break;
        default:
          this.displayWelcomeScreen();
      }
    });
  }

  // Demander le nom du joueur
  askPlayerName() {
    console.clear();
    console.log("\n  Entrez votre nom: ");
    rl.question("", (name) => {
      this.playerName = name.trim() || "Joueur";
      this.startGame();
    });
  }

  // Démarrer la partie
  startGame() {
    this.createDeck();
    this.shuffleDeck();
    this.hand = this.deck.splice(0, 8);
    this.displayGameScreen();
  }

  // Afficher l'écran principal du jeu
  displayGameScreen() {
    console.clear();
    console.log(`\n  ═════════════════ ROYAL FORTUNE ═════════════════`);
    console.log(`  Joueur: ${this.playerName}   Niveau: ${this.currentLevel + 1}   Score: ${this.score}`);
    console.log(`  Objectif: ${this.objective}   Mains restantes: ${this.remainingHands}   Défausses: ${this.discardCount}`);
    
    if (this.combo > 0) {
      console.log(`  COMBO: x${this.combo + 1} 🔥`);
    }
    
    console.log(`\n  Votre main:`);
    this.displayHand();
    
    console.log(`\n  Actions disponibles:`);
    console.log(`  [1-8] Sélectionner/Désélectionner une carte`);
    console.log(`  [J] Jouer les cartes sélectionnées`);
    console.log(`  [D] Défausser les cartes sélectionnées`);
    console.log(`  [H] Historique des mains jouées`);
    console.log(`  [Q] Quitter`);

    console.log(`\n  Cartes sélectionnées: ${this.selectedCards.length ? this.selectedCards.map(i => i + 1).join(", ") : "Aucune"}`);
    console.log(`  Entrez votre choix: `);
    
    rl.question("", (choice) => {
      if (/^[1-8]$/.test(choice)) {
        const index = parseInt(choice) - 1;
        this.toggleCardSelection(index);
      } else {
        switch (choice.toUpperCase()) {
          case "J":
            this.playSelectedCards();
            break;
          case "D":
            this.discardSelectedCards();
            break;
          case "H":
            this.showHandHistory();
            break;
          case "Q":
            this.gameOver();
            return;
          default:
            console.log("  Choix invalide. Appuyez sur Entrée pour continuer...");
            rl.question("", () => this.displayGameScreen());
            return;
        }
      }
    });
  }

  // Afficher les cartes de la main
  displayHand() {
    const selectedMarker = "▶";
    for (let i = 0; i < this.hand.length; i++) {
      const card = this.hand[i];
      const isSelected = this.selectedCards.includes(i);
      const marker = isSelected ? selectedMarker : " ";
      console.log(`  ${marker} [${i + 1}] ${card.suit} ${card.value}`);
    }
  }

  // Sélectionner/désélectionner une carte
  toggleCardSelection(index) {
    const cardIndex = this.selectedCards.indexOf(index);
    if (cardIndex === -1) {
      this.selectedCards.push(index);
    } else {
      this.selectedCards.splice(cardIndex, 1);
    }
    this.displayGameScreen();
  }

  // Jouer les cartes sélectionnées
  playSelectedCards() {
    if (this.selectedCards.length === 0) {
      console.log("  Vous devez sélectionner des cartes à jouer! Appuyez sur Entrée pour continuer...");
      rl.question("", () => this.displayGameScreen());
      return;
    }

    const selectedCardsList = this.selectedCards.map(index => this.hand[index]);
    const result = this.checkHand(selectedCardsList);
    
    if (result.points <= 0) {
      console.log("  Pas de combinaison valide! Appuyez sur Entrée pour continuer...");
      rl.question("", () => this.displayGameScreen());
      return;
    }
    
    let finalPoints = result.points;
    
    if (this.lastCombination === result.type) {
      this.combo++;
      finalPoints *= (1 + this.combo * 0.5);
    } else {
      this.combo = 0;
    }
    
    this.lastCombination = result.type;
    
    this.score += Math.floor(finalPoints);
    this.remainingHands--;
    
    this.handHistory.push({
      cards: selectedCardsList,
      points: Math.floor(finalPoints),
      type: result.type
    });
    
    console.clear();
    console.log(`\n  ══════════════════════════════════════════`);
    console.log(`   ${result.type.toUpperCase()} !`);
    console.log(`   Points gagnés: ${Math.floor(finalPoints)}`);
    console.log(`  ══════════════════════════════════════════\n`);
    
    if (this.score >= this.objective) {
      if (this.currentLevel < OBJECTIVES.length - 1) {
        this.currentLevel++;
        this.objective = OBJECTIVES[this.currentLevel];
        this.remainingHands = 5;
        this.discardCount = 3;
        console.log(`  NIVEAU COMPLÉTÉ! Vous passez au niveau ${this.currentLevel + 1}!\n`);
        console.log(`  Nouvel objectif: ${this.objective} points\n`);
      } else {
        console.log(`  FÉLICITATIONS! Vous avez terminé tous les niveaux!\n`);
        this.gameOver();
        return;
      }
    } else if (this.remainingHands <= 0) {
      console.log(`  Vous n'avez plus de mains disponibles.\n`);
      this.gameOver();
      return;
    }

    // Remplacer les cartes jouées
    let newHand = [];
    for (let i = 0; i < this.hand.length; i++) {
      if (!this.selectedCards.includes(i)) {
        newHand.push(this.hand[i]);
      }
    }
    
    const cardsNeeded = 8 - newHand.length;
    const newCards = this.deck.splice(0, cardsNeeded);
    
    if (newCards.length < cardsNeeded) {
      console.log("  Plus assez de cartes dans le deck. La partie se termine.");
      this.gameOver();
      return;
    }
    
    this.hand = [...newHand, ...newCards];
    this.selectedCards = [];
    
    console.log(`  Appuyez sur Entrée pour continuer...`);
    rl.question("", () => this.displayGameScreen());
  }

  // Défausser les cartes sélectionnées
  discardSelectedCards() {
    if (this.selectedCards.length === 0) {
      console.log("  Vous devez sélectionner des cartes à défausser! Appuyez sur Entrée pour continuer...");
      rl.question("", () => this.displayGameScreen());
      return;
    }

    if (this.selectedCards.length > 5) {
      console.log("  Vous ne pouvez défausser que 5 cartes maximum à la fois! Appuyez sur Entrée pour continuer...");
      rl.question("", () => this.displayGameScreen());
      return;
    }

    if (this.discardCount <= 0) {
      console.log("  Vous n'avez plus de défausses disponibles! Appuyez sur Entrée pour continuer...");
      rl.question("", () => this.displayGameScreen());
      return;
    }

    // Trier les index en ordre décroissant pour éviter les problèmes lors de la suppression
    const sortedIndices = [...this.selectedCards].sort((a, b) => b - a);
    
    for (const index of sortedIndices) {
      const newCard = this.deck.shift();
      if (newCard) {
        this.hand[index] = newCard;
      } else {
        console.log("  Plus de cartes dans le deck. La partie se termine.");
        this.gameOver();
        return;
      }
    }
    
    this.discardCount--;
    this.selectedCards = [];
    
    console.log(`  Cartes défaussées avec succès! Il vous reste ${this.discardCount} défausses.`);
    console.log(`  Appuyez sur Entrée pour continuer...`);
    rl.question("", () => this.displayGameScreen());
  }

  // Afficher l'historique des mains jouées
  showHandHistory() {
    console.clear();
    console.log(`\n  ═════════════ HISTORIQUE DES MAINS ═════════════`);
    
    if (this.handHistory.length === 0) {
      console.log("  Aucune main jouée pour le moment.");
    } else {
      this.handHistory.forEach((hand, index) => {
        console.log(`\n  Main #${index + 1}:`);
        console.log(`  Combinaison: ${hand.type}`);
        console.log(`  Points: ${hand.points}`);
        console.log(`  Cartes: ${hand.cards.map(card => `${card.suit} ${card.value}`).join(', ')}`);
      });
    }
    
    console.log(`\n  Appuyez sur Entrée pour revenir au jeu...`);
    rl.question("", () => this.displayGameScreen());
  }

  // Fin de partie
  gameOver() {
    console.clear();
    console.log(`\n  ═════════════════ PARTIE TERMINÉE ═════════════════`);
    console.log(`\n  Joueur: ${this.playerName}`);
    console.log(`  Score final: ${this.score}`);
    console.log(`  Niveau atteint: ${this.currentLevel + 1}`);
    
    this.saveScore(this.playerName, this.score, this.currentLevel + 1);
    
    console.log(`\n  Votre score a été enregistré!`);
    console.log(`\n  1. Nouvelle partie`);
    console.log(`  2. Voir les meilleurs scores`);
    console.log(`  3. Quitter`);
    
    rl.question("\n  Choisissez une option (1-3): ", (choice) => {
      switch (choice) {
        case "1":
          this.newGame();
          break;
        case "2":
          this.displayLeaderboard();
          break;
        case "3":
          console.log("\n  Merci d'avoir joué! Au revoir!");
          rl.close();
          break;
        default:
          this.gameOver();
      }
    });
  }

  // Sauvegarder le score
  saveScore(playerName, score, level) {
    try {
      const newScore = {
        id: Date.now().toString(),
        playerName: playerName.trim() || "Joueur",
        score,
        level,
        date: new Date().toISOString()
      };
      
      this.scores.push(newScore);
      
      // Trier et limiter à 100 scores
      this.scores = this.scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);
      
      // Enregistrer dans un fichier (en version terminal on simule cela en mémoire)
      // Dans un vrai environnement Node.js on utiliserait fs.writeFileSync
      
      return newScore;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du score", error);
      return {
        id: Date.now().toString(),
        playerName,
        score,
        level,
        date: new Date().toISOString()
      };
    }
  }

  // Charger les scores (simulé en mémoire)
  loadScores() {
    // Dans un vrai environnement Node.js on utiliserait fs.readFileSync
    return [];
  }

  // Afficher le tableau des scores
  displayLeaderboard() {
    console.clear();
    console.log(`\n  ═════════════════ MEILLEURS SCORES ═════════════════`);
    
    if (this.scores.length === 0) {
      console.log("\n  Aucun score enregistré pour le moment.");
    } else {
      console.log("\n  Rang | Joueur           | Score   | Niveau | Date");
      console.log("  ─────┼──────────────────┼─────────┼────────┼────────────────");
      
      this.scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .forEach((score, index) => {
          const date = new Date(score.date).toLocaleDateString();
          console.log(`  ${(index + 1).toString().padEnd(5)}| ${score.playerName.padEnd(18)}| ${score.score.toString().padEnd(8)}| ${score.level.toString().padEnd(7)}| ${date}`);
        });
    }
    
    console.log(`\n  Appuyez sur Entrée pour revenir au menu principal...`);
    rl.question("", () => this.displayWelcomeScreen());
  }
}

// Démarrer le jeu
console.clear();
console.log("\n  Chargement de Royal Fortune...");

// Démarrer le jeu
const game = new RoyalFortune();
game.newGame();

// En cas de sortie, fermer proprement l'interface readline
process.on('exit', () => {
  rl.close();
});

