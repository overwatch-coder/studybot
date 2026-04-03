import { GeneratedContentKind } from "@/lib/storage/db";
import { loadGeneratedContent, saveGeneratedContent } from "@/lib/storage/generatedContent";
import { getCurrentSessionRecord } from "@/lib/storage/sessions";

export const useGeneratedContent = <TContent,>(kind: GeneratedContentKind) => {
  const loadCurrentContent = async (): Promise<TContent | null> => {
    const session = await getCurrentSessionRecord();

    if (!session) {
      return null;
    }

    const savedContent = await loadGeneratedContent(session.id, kind);
    return (savedContent?.content as TContent | undefined) ?? null;
  };

  const saveCurrentContent = async (content: TContent) => {
    const session = await getCurrentSessionRecord();

    if (!session) {
      return null;
    }

    return saveGeneratedContent({
      sessionId: session.id,
      kind,
      content,
    });
  };

  return {
    loadCurrentContent,
    saveCurrentContent,
  };
};