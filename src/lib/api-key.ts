export type { AIProviderType } from "./ai-provider";

const KEY_STORAGE_KEY = "studybot_api_key";
const PROVIDER_STORAGE_KEY = "studybot_api_provider";

import type { AIProviderType } from "./ai-provider";

export const getApiKey = (): string =>
  localStorage.getItem(KEY_STORAGE_KEY) ?? "";

export const getProvider = (): AIProviderType =>
  (localStorage.getItem(PROVIDER_STORAGE_KEY) as AIProviderType) ?? "openai";

export const setApiKey = (key: string) =>
  localStorage.setItem(KEY_STORAGE_KEY, key);

export const setProvider = (provider: AIProviderType) =>
  localStorage.setItem(PROVIDER_STORAGE_KEY, provider);

export const clearApiSettings = () => {
  localStorage.removeItem(KEY_STORAGE_KEY);
  localStorage.removeItem(PROVIDER_STORAGE_KEY);
};

// Legacy symbol kept so that old import sites have a clear compile error pointing here.
// Remove once all callers are migrated to getApiKey().
/** @deprecated Use getApiKey() for runtime key access */
export const apiKey = undefined as never;

