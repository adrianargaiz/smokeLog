import { useSurvey } from '../../contexts/SurveyContext';

/**
 * Question 6: ¿Qué es lo más difícil de dejar de fumar?
 */
export default function Question6() {
  const { answers, setAnswer } = useSurvey();
  const selectedDifficulty = answers.q6_difficulty;
  const smokeType = answers.q1_type || 'vapear';
  const verb = smokeType === 'fumar' ? 'fumar' : 'vapear';

  const handleSelect = (difficulty: string) => {
    setAnswer('q6_difficulty', difficulty);
  };

  const options: { value: string; label: string; emoji: string }[] = [
    { value: 'cravings', label: 'Antojos', emoji: '😤' },
    { value: 'stress', label: 'Estrés', emoji: '😣' },
    { value: 'social_pressure', label: 'Presión social', emoji: '🧑' },
    { value: 'boredom', label: 'Aburrimiento', emoji: '😐' },
    { value: 'anxiety', label: 'Ansiedad', emoji: '😔' },
    { value: 'not_sure', label: 'No estoy seguro', emoji: '🤔' },
  ];

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12 leading-tight px-4">
        ¿Qué es lo más difícil de
        <br />
        dejar de {verb}?
      </h1>

      {/* Options */}
      <div className="space-y-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
              selectedDifficulty === option.value
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
