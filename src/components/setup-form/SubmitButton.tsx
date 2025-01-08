import React from "react";
import { Button } from "../ui/button";

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
    </Button>
  );
};

export default SubmitButton;