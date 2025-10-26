import { SurveyProvider } from '../contexts/SurveyContext';
import { useSurvey } from '../hooks/useSurvey';
import SurveyLayout from '../components/survey/SurveyLayout';
import Question1 from '../components/survey/Question1';
import Question2 from '../components/survey/Question2';
import Question3 from '../components/survey/Question3';
import Question4 from '../components/survey/Question4';
import Question5 from '../components/survey/Question5';
import Question6 from '../components/survey/Question6';
import Question7 from '../components/survey/Question7';
import Question8 from '../components/survey/Question8';

import type { SurveyAnswers } from '../types';

interface SurveyViewProps {
  onComplete: (answers: SurveyAnswers) => void;
}

/**
 * SurveyFlow - Main controller for the 8-question onboarding survey
 *
 * Manages:
 * - Question navigation (forward/backward)
 * - Answer persistence
 * - Progress tracking
 * - Survey completion and data submission
 */
function SurveyFlow({ onComplete }: SurveyViewProps) {
  const {
    currentQuestion,
    answers,
    nextQuestion,
    previousQuestion,
    skipQuestion,
  } = useSurvey();

  const totalQuestions = 8;

  // Render the appropriate question component
  const renderQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return <Question1 />;
      case 2:
        return <Question2 />;
      case 3:
        return <Question3 />;
      case 4:
        return <Question4 />;
      case 5:
        return <Question5 />;
      case 6:
        return <Question6 />;
      case 7:
        return <Question7 />;
      case 8:
        return <Question8 />;
      default:
        return <Question1 />;
    }
  };

  // Check if current question has been answered
  const isQuestionAnswered = () => {
    switch (currentQuestion) {
      case 1:
        return answers.q1_type !== null;
      case 2:
        return answers.q2_goal !== null;
      case 3:
        return answers.q3_duration !== null;
      case 4:
        return answers.q4_frequency !== null;
      case 5:
        return answers.q5_dailyAmount !== null;
      case 6:
        return answers.q6_difficulty !== null;
      case 7:
        return answers.q7_affectedArea !== null;
      case 8:
        return answers.q8_monthlySpending !== null;
      default:
        return false;
    }
  };

  // Handle next button click
  const handleNext = () => {
    if (currentQuestion === totalQuestions) {
      // Complete survey
      handleComplete();
    } else {
      nextQuestion();
    }
  };

  // Complete survey and pass data to parent
  const handleComplete = () => {
    // Save survey answers to localStorage
    localStorage.setItem('smokelog_survey_answers', JSON.stringify(answers));
    localStorage.setItem('smokelog_survey_completed', 'true');

    // Pass answers to parent component
    onComplete(answers);
  };

  return (
    <SurveyLayout
      currentQuestion={currentQuestion}
      totalQuestions={totalQuestions}
      onBack={previousQuestion}
      onSkip={skipQuestion}
      showBackButton={currentQuestion > 1}
      showSkipButton={true}
    >
      {/* Question Content */}
      <div className="min-h-[60vh]">{renderQuestion()}</div>

      {/* Next/Continue Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 border-t border-gray-100">
        <button
          onClick={handleNext}
          disabled={!isQuestionAnswered()}
          className={`w-full max-w-md mx-auto block py-4 px-8 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-200 ${
            isQuestionAnswered()
              ? 'bg-blue-400 hover:bg-blue-500 text-white active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion === totalQuestions ? 'FINISH' : 'NEXT'}
        </button>
      </div>
    </SurveyLayout>
  );
}

/**
 * SurveyView - Wrapper component that provides SurveyContext
 */
export default function SurveyView({ onComplete }: SurveyViewProps) {
  return (
    <SurveyProvider>
      <SurveyFlow onComplete={onComplete} />
    </SurveyProvider>
  );
}
