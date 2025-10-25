import { useSurvey } from '../../contexts/SurveyContext';

/**
 * Question 4: ¿Cada cuánto fumas/vapeas?
 */
export default function Question4() {
  const { answers, setAnswer } = useSurvey();
  const selectedFrequency = answers.q4_frequency;
  const smokeType = answers.q1_type || 'vapear';
  const verb = smokeType === 'fumar' ? 'fumas' : 'vapeas';

  const handleSelect = (frequency: string) => {
    setAnswer('q4_frequency', frequency);
  };

  const options: { value: string; label: string; emoji: string }[] = [
    { value: 'occasionally', label: 'De vez en cuando', emoji: '🟢' },
    { value: 'few_times_day', label: 'Unas pocas veces al día', emoji: '☁️' },
    { value: 'constantly', label: 'Constantemente', emoji: '🚭' },
    { value: 'only_parties', label: 'Solo de fiesta', emoji: '🎉' },
  ];

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12 leading-tight">
        ¿Cada cuánto
        <br />
        {verb}?
      </h1>

      {/* Options */}
      <div className="space-y-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
              selectedFrequency === option.value
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
