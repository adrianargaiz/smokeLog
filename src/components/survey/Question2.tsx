import { useSurvey } from '../../hooks/useSurvey';
import type { GoalType } from '../../types';

/**
 * Question 2: ¿Cuál es tu objetivo?
 * CRITICAL - Determines plan strategy (complete quit vs reduction)
 */
export default function Question2() {
  const { answers, setAnswer } = useSurvey();
  const selectedGoal = answers.q2_goal;

  const handleSelect = (goal: GoalType) => {
    setAnswer('q2_goal', goal);
  };

  const options: { value: GoalType; label: string; emoji: string }[] = [
    { value: 'complete', label: 'Dejarlo por completo', emoji: '🔴' },
    { value: 'reduce', label: 'Rebajar la cantidad', emoji: '📉' },
  ];

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12 leading-tight">
        ¿Cuál es tu objetivo?
      </h1>

      {/* Options */}
      <div className="space-y-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
              selectedGoal === option.value
                ? 'bg-blue-400 text-white shadow-md scale-[1.02]'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98]'
            }`}
          >
            <span className="text-2xl">{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
