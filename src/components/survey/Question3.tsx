import { useSurvey } from '../../contexts/SurveyContext';

/**
 * Question 3: ¿Cuánto tiempo llevas fumando/vapeando?
 */
export default function Question3() {
  const { answers, setAnswer } = useSurvey();
  const selectedDuration = answers.q3_duration;
  const smokeType = answers.q1_type || 'vapear';
  const activity = smokeType === 'fumar' ? 'fumando' : 'vapeando';

  const handleSelect = (duration: string) => {
    setAnswer('q3_duration', duration);
  };

  const options: { value: string; label: string; emoji: string }[] = [
    { value: 'less_than_month', label: 'Menos de un mes', emoji: '🌱' },
    { value: '1-6_months', label: '1-6 meses', emoji: '🌿' },
    { value: '6-12_months', label: '6-12 meses', emoji: '🌳' },
    { value: '1-2_years', label: '1-2 años', emoji: '🌲' },
    { value: 'over_2_years', label: 'Más de 2 años', emoji: '🌋' },
  ];

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12 leading-tight">
        ¿Cuánto tiempo llevas
        <br />
        {activity}?
      </h1>

      {/* Options */}
      <div className="space-y-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
              selectedDuration === option.value
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
