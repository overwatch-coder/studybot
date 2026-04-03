import React from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getApiKey,
  getProvider,
  setApiKey,
  setProvider,
  clearApiSettings,
} from "@/lib/api-key";
import type { AIProviderType } from "@/lib/api-key";

const PROVIDER_OPTIONS: { value: AIProviderType; label: string; hint: string }[] = [
  {
    value: "openai",
    label: "OpenAI",
    hint: "Starts with sk-…  (GPT-4o-mini)",
  },
  {
    value: "gemini",
    label: "Google Gemini",
    hint: "Starts with AIza… (Gemini 2.0 Flash)",
  },
];

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ open, onClose }) => {
  const [provider, setProviderState] = React.useState<AIProviderType>(getProvider);
  const [key, setKey] = React.useState(getApiKey);
  const [showKey, setShowKey] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setProviderState(getProvider());
      setKey(getApiKey());
      setSaved(false);
    }
  }, [open]);

  const handleSave = () => {
    setApiKey(key.trim());
    setProvider(provider);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  const handleClear = () => {
    clearApiSettings();
    setKey("");
    setProviderState("openai");
    setSaved(false);
  };

  const isValid = key.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <KeyRound className="h-5 w-5 text-primary" />
            API Key Settings
          </DialogTitle>
          <DialogDescription>
            Your key is stored locally and never sent to any server other than the AI provider.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">AI Provider</legend>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setProviderState(opt.value);
                    setSaved(false);
                  }}
                  className={[
                    "flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-all duration-150",
                    provider === opt.value
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 text-foreground",
                  ].join(" ")}
                >
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">{opt.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="api-key-input" className="text-foreground">API Key</Label>
            <div className="relative">
              <Input
                id="api-key-input"
                type={showKey ? "text" : "password"}
                placeholder={
                  provider === "openai" ? "sk-…" : "AIza…"
                }
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setSaved(false);
                }}
                className="pr-10 font-mono text-sm"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {saved && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </p>
          )}
          {!isValid && !saved && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              No key configured — AI features will not work
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1"
            >
              Save
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ApiKeyButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [hasKey, setHasKey] = React.useState(() => getApiKey().length > 0);

  const handleClose = () => {
    setOpen(false);
    setHasKey(getApiKey().length > 0);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={hasKey ? "API key configured — click to change" : "No API key — click to add"}
        className={[
          "fixed top-20 right-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition-all duration-200",
          hasKey
            ? "bg-white text-emerald-700 hover:shadow-md border border-emerald-200"
            : "bg-white text-amber-700 hover:shadow-md border border-amber-300 animate-pulse",
        ].join(" ")}
      >
        <KeyRound className="h-3.5 w-3.5" />
        {hasKey ? "Key set" : "Add API key"}
      </button>
      <ApiKeyModal open={open} onClose={handleClose} />
    </>
  );
};

export default ApiKeyModal;
