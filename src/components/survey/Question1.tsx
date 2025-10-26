import { useSurvey } from '../../hooks/useSurvey';
import type { SmokeType } from '../../types';

/**
 * Question 1: ¿Con qué te gustaría que te ayudemos?
 * CRITICAL - Determines measurement unit (cigarros vs caladas)
 */
export default function Question1() {
  const { answers, setAnswer } = useSurvey();
  const selectedType = answers.q1_type;

  const handleSelect = (type: SmokeType) => {
    setAnswer('q1_type', type);
  };

  const options: { value: SmokeType; label: string; emoji: string }[] = [
    { value: 'fumar', label: 'Dejar de fumar', emoji: '🚬' },
    { value: 'vapear', label: 'Dejar de vapear', emoji: '💨' },
  ];

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12 leading-tight">
        ¿Con qué te gustaría
        <br />
        que te ayudemos?
      </h1>

      {/* Options */}
      <div className="space-y-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
              selectedType === option.value
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
