import type { StudyOption } from "@/components/StudyOptions";

const STUDY_OPTION_KEY = "current_study_option";

export const setCurrentStudyOption = (studyOption: StudyOption) => {
  localStorage.setItem(STUDY_OPTION_KEY, studyOption);
};

export const getCurrentStudyOption = (): StudyOption | null => {
  const studyOption = localStorage.getItem(STUDY_OPTION_KEY);

  if (
    studyOption === "summary" ||
    studyOption === "flashcards" ||
    studyOption === "quiz" ||
    studyOption === "questions" ||
    studyOption === "guide" ||
    studyOption === "chat"
  ) {
    return studyOption;
  }

  return null;
};

export const clearCurrentStudyOption = () => {
  localStorage.removeItem(STUDY_OPTION_KEY);
};