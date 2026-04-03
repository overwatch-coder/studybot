// src/components/ProcessingModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type StageStatus = "pending" | "active" | "complete" | "error";

export interface ProcessingStage {
  id: string;
  label: string;
  subLabel?: string;
  status: StageStatus;
}

export interface ProcessingModalProps {
  open: boolean;
  stages: ProcessingStage[];
  isComplete?: boolean;
  error?: string | null;
  onContinue?: () => void;
  onRetry?: () => void;
  onRestart?: () => void;
}

const StageIcon: React.FC<{ status: StageStatus }> = ({ status }) => {
  if (status === "active") {
    return <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />;
  }
  if (status === "complete") {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      </motion.div>
    );
  }
  if (status === "error") {
    return <XCircle className="w-5 h-5 text-red-500" />;
  }
  // pending
  return (
    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
  );
};

const ConnectorLine: React.FC<{ complete: boolean }> = ({ complete }) => (
  <div className="flex justify-center w-5 my-0.5">
    <motion.div
      className="w-0.5 h-5 rounded-full"
      initial={{ backgroundColor: "#d1d5db" }}
      animate={{ backgroundColor: complete ? "#22c55e" : "#d1d5db" }}
      transition={{ duration: 0.4 }}
    />
  </div>
);

const StageList: React.FC<{ stages: ProcessingStage[] }> = ({ stages }) => (
  <div className="flex flex-col">
    {stages.map((stage, i) => (
      <React.Fragment key={stage.id}>
        <div className="flex items-start gap-3 py-1">
          <div className="mt-0.5 flex-shrink-0">
            <StageIcon status={stage.status} />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium leading-5 ${
                stage.status === "active"
                  ? "text-foreground"
                  : stage.status === "complete"
                  ? "text-green-600 dark:text-green-400"
                  : stage.status === "error"
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              {stage.label}
            </span>
            <AnimatePresence>
              {stage.subLabel && (
                <motion.span
                  key={stage.subLabel}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="text-xs text-muted-foreground leading-4"
                >
                  {stage.subLabel}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        {i < stages.length - 1 && (
          <ConnectorLine complete={stage.status === "complete"} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const CompletionView: React.FC<{ onContinue?: () => void }> = ({ onContinue }) => (
  <motion.div
    key="complete"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center gap-4 py-4"
  >
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <motion.circle
          cx="32" cy="32" r="28"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M20 32 L28 40 L44 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        />
      </svg>
    </div>
    <div className="text-center">
      <p className="text-base font-semibold text-foreground">All done!</p>
      <p className="text-sm text-muted-foreground mt-0.5">
        Your materials are ready.
      </p>
    </div>
    <Button onClick={onContinue} className="mt-2 w-full">
      Continue
    </Button>
  </motion.div>
);

const ErrorPanel: React.FC<{
  message: string;
  onRetry?: () => void;
  onRestart?: () => void;
}> = ({ message, onRetry, onRestart }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
    className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-4"
  >
    <p className="text-sm text-red-700 dark:text-red-400 mb-3">{message}</p>
    <div className="flex gap-2">
      <Button size="sm" onClick={onRetry} className="flex-1">
        Try Again
      </Button>
      <Button size="sm" variant="outline" onClick={onRestart} className="flex-1">
        Start Over
      </Button>
    </div>
  </motion.div>
);

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  open,
  stages,
  isComplete = false,
  error,
  onContinue,
  onRetry,
  onRestart,
}) => {
  const canClose = !!error || isComplete;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !canClose) return;
        if (!next && error && onRestart) onRestart();
      }}
    >
      <DialogContent
        className={`max-w-sm ${!canClose ? "[&>button.absolute]:hidden" : ""}`}
        onPointerDownOutside={(e) => { if (!canClose) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (!canClose) e.preventDefault(); }}
      >
        <DialogTitle className="text-base font-semibold mb-4">
          Processing your files
        </DialogTitle>

        <AnimatePresence mode="wait">
          {isComplete && !error ? (
            <CompletionView key="done" onContinue={onContinue} />
          ) : (
            <motion.div key="stages" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StageList stages={stages} />
              <AnimatePresence>
                {error && (
                  <ErrorPanel
                    key="error-panel"
                    message={error}
                    onRetry={onRetry}
                    onRestart={onRestart}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessingModal;
