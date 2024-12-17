import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardsProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const Flashcards: React.FC<FlashcardsProps> = ({ courseInfo }) => {
  const [cards, setCards] = React.useState<Array<{ front: string; back: string }>>([]);
  const [currentCard, setCurrentCard] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate AI content generation
    setTimeout(() => {
      const demoCards = [
        {
          front: courseInfo.language === "French" ? "Question 1 en français" : "Question 1 in English",
          back: courseInfo.language === "French" ? "Réponse 1 en français" : "Answer 1 in English",
        },
        {
          front: courseInfo.language === "French" ? "Question 2 en français" : "Question 2 in English",
          back: courseInfo.language === "French" ? "Réponse 2 en français" : "Answer 2 in English",
        },
      ];
      setCards(demoCards);
      setLoading(false);
    }, 1500);
  }, [courseInfo]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">
        {courseInfo.language === "French" ? "Cartes mémoire" : "Flashcards"}
      </h2>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="glass-card w-80 h-48 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full h-full flex items-center justify-center p-6 text-center">
            {!isFlipped ? cards[currentCard].front : cards[currentCard].back}
          </div>
        </motion.div>
        <button
          onClick={handleNext}
          className="btn-primary"
        >
          {courseInfo.language === "French" ? "Suivant" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Flashcards;