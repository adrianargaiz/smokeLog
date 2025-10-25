import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { SurveyAnswers } from '../types';

interface SurveyContextType {
  answers: SurveyAnswers;
  currentQuestion: number;
  setAnswer: (questionKey: keyof SurveyAnswers, value: any) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  skipQuestion: () => void;
  goToQuestion: (questionNumber: number) => void;
  resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const initialAnswers: SurveyAnswers = {
  q1_type: null,
  q2_goal: null,
  q3_duration: null,
  q4_frequency: null,
  q5_dailyAmount: null,
  q6_difficulty: null,
  q7_affectedArea: null,
  q8_monthlySpending: null,
};

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const setAnswer = (questionKey: keyof SurveyAnswers, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < 8) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  const goToQuestion = (questionNumber: number) => {
    if (questionNumber >= 1 && questionNumber <= 8) {
      setCurrentQuestion(questionNumber);
    }
  };

  const resetSurvey = () => {
    setAnswers(initialAnswers);
    setCurrentQuestion(1);
  };

  return (
    <SurveyContext.Provider
      value={{
        answers,
        currentQuestion,
        setAnswer,
        nextQuestion,
        previousQuestion,
        skipQuestion,
        goToQuestion,
        resetSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
