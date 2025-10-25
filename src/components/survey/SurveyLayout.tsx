import type { ReactNode } from 'react';

interface SurveyLayoutProps {
  children: ReactNode;
  currentQuestion: number;
  totalQuestions: number;
  onBack?: () => void;
  onSkip?: () => void;
  showBackButton?: boolean;
  showSkipButton?: boolean;
}

/**
 * SurveyLayout - Wrapper component for all survey questions
 *
 * Features:
 * - Progress bar at top showing X/8 completion
 * - Back arrow button (top left) - only shown after Q1
 * - Skip button (top right)
 * - Consistent spacing and mobile-optimized layout
 * - Light background matching reference images
 */
export default function SurveyLayout({
  children,
  currentQuestion,
  totalQuestions,
  onBack,
  onSkip,
  showBackButton = true,
  showSkipButton = true,
}: SurveyLayoutProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="h-1.5 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Header with Back and Skip */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className={`flex items-center justify-center w-10 h-10 transition-opacity ${
              showBackButton && currentQuestion > 1
                ? 'opacity-100 active:opacity-60'
                : 'opacity-0 pointer-events-none'
            }`}
            disabled={!showBackButton || currentQuestion === 1}
            aria-label="Go back"
          >
            <span
              className="text-gray-400 font-bold leading-none"
              style={{
                fontSize: '28px',
                color: '#9ca3af',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              ←
            </span>
          </button>

          {/* Question Counter */}
          <div className="text-gray-400 text-base font-medium">
            {currentQuestion}/{totalQuestions}
          </div>

          {/* Skip Button */}
          {showSkipButton ? (
            <button
              onClick={onSkip}
              className="text-gray-400 text-base font-medium px-2 py-1 active:opacity-60 transition-opacity"
            >
              Skip
            </button>
          ) : (
            <div className="w-14" /> // Spacer for alignment
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-16 min-h-screen">
        {children}
      </div>
    </div>
  );
}
