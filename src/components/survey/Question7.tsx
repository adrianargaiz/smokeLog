import { useSurvey } from '../../hooks/useSurvey';

/**
 * Question 7: ¿Qué parte de tu vida se ve más afectada por el vapeo/tabaquismo?
 */
export default function Question7() {
  const { answers, setAnswer } = useSurvey();
  const selectedArea = answers.q7_affectedArea;
  const smokeType = answers.q1_type || 'vapear';
  const noun = smokeType === 'fumar' ? 'tabaquismo' : 'vapeo';

  const handleSelect = (area: string) => {
    setAnswer('q7_affectedArea', area);
  };

  const options: { value: string; label: string; emoji: string }[] = [
    { value: 'health', label: 'Mi salud', emoji: '🩺' },
    { value: 'mental_health', label: 'Mi salud mental', emoji: '🧠' },
    { value: 'finances', label: 'Mi dinero', emoji: '💸' },
    { value: 'relationships', label: 'Mis relaciones', emoji: '🤝' },
    { value: 'energy', label: 'Mi energía y concentración', emoji: '⚡' },
  ];

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12 leading-tight px-2">
        ¿Qué parte de tu vida se ve más
        <br />
        afectada por el {noun}?
      </h1>

      {/* Options */}
      <div className="space-y-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
              selectedArea === option.value
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
