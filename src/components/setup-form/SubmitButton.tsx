import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  language: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, language }) => {
  return (
    <Button type="submit" className="btn-primary w-full" disabled={loading}>
      {loading
        ? language === "French"
          ? "Traitement..."
          : "Processing..."
        : language === "French"
        ? "Continuer"
        : "Continue"}
      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
};

export default SubmitButton;
