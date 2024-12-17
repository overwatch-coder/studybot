import React from "react";
import { motion } from "framer-motion";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";

interface FlashcardsProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
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
        courseInfo.language
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
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">
        {courseInfo.language === "French" ? "Cartes mémoire" : "Flashcards"}
      </h2>

      <div className="glass-card p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
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
            className="w-full"
          />
        </div>

        <Button onClick={generateCards} disabled={loading} className="w-full">
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
        <div className="flex flex-col items-center gap-4">
          <motion.div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-80 h-48 relative cursor-pointer"
            animate={{
              rotateY: isFlipped ? 180 : 0,
            }}
            transition={{ duration: 0.8 }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="glass-card w-full h-full flex items-center justify-center p-6 text-center absolute backface-hidden"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              {cards[currentCard].front}
            </div>
            <div
              className="glass-card w-full h-full flex items-center justify-center p-6 text-center absolute backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {cards[currentCard].back}
            </div>
          </motion.div>
          <Button onClick={handleNext}>
            {courseInfo.language === "French" ? "Suivant" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
