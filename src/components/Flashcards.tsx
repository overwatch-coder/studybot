
import React from "react";
import { motion } from "framer-motion";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";

interface FlashcardsProps {
  courseInfo: CourseInfo;
}

const Flashcards: React.FC<FlashcardsProps> = ({ courseInfo }) => {
  const [cards, setCards] = React.useState<
    Array<{ front: string; back: string }>
  >([]);
  const [currentCard, setCurrentCard] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState(5);
  const { toast } = useToast();

  const generateCards = async () => {
    if (!apiKey) {
      toast({
        title:
          courseInfo.language === "French"
            ? "Clé API requise"
            : "API Key Required",
        description:
          courseInfo.language === "French"
            ? "Veuillez entrer votre clé API Perplexity"
            : "Please enter your Perplexity API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt =
        courseInfo.language === "French"
          ? `Génère ${quantity} flashcards pour le module "${courseInfo.module}" au niveau ${courseInfo.level}. Format : tableau JSON avec "front" et "back" pour chaque carte. Commence directement par la réponse formatée. Aucun texte ou phrase avant ou après.`
          : `Generate ${quantity} flashcards for the "${courseInfo.module}" module at ${courseInfo.level} level. Format: JSON array with "front" and "back" for each card. Start directly with the formatted response. No texts or sentences before or after.`;

      const response = await generateAIContent(
        apiKey,
        prompt,
        courseInfo.language,
        courseInfo.pdfContent
      );
      const generatedCards = JSON.parse(response);
      setCards(generatedCards);
      setCurrentCard(0);
      setIsFlipped(false);
    } catch (error) {
      toast({
        title: courseInfo.language === "French" ? "Erreur" : "Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <h2 className="text-xl sm:text-2xl font-bold text-white">
        {courseInfo.language === "French" ? "Cartes mémoire" : "Flashcards"}
      </h2>

      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium">
            {courseInfo.language === "French"
              ? "Nombre de cartes"
              : "Number of cards"}
          </label>
          <Input
            type="number"
            min="1"
            max="20"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full text-xs sm:text-sm"
          />
        </div>

        <Button onClick={generateCards} disabled={loading} className="w-full text-xs sm:text-sm">
          {loading
            ? courseInfo.language === "French"
              ? "Génération..."
              : "Generating..."
            : courseInfo.language === "French"
            ? "Générer"
            : "Generate"}
        </Button>
      </div>

      {cards.length > 0 && (
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <motion.div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full sm:w-80 h-36 sm:h-48 relative cursor-pointer"
            animate={{
              rotateY: isFlipped ? 180 : 0,
            }}
            transition={{ duration: 0.8 }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="glass-card w-full h-full flex items-center justify-center p-4 sm:p-6 text-center absolute backface-hidden text-sm sm:text-base"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              {cards[currentCard].front}
            </div>
            <div
              className="glass-card w-full h-full flex items-center justify-center p-4 sm:p-6 text-center absolute backface-hidden text-sm sm:text-base"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {cards[currentCard].back}
            </div>
          </motion.div>
          <Button onClick={handleNext} className="text-xs sm:text-sm">
            {courseInfo.language === "French" ? "Suivant" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
