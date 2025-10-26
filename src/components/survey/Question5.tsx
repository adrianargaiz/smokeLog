import { useSurvey } from '../../hooks/useSurvey';
import PickerWheel from './PickerWheel';

/**
 * Question 5: ¿Cuántas caladas/cigarros consumes al día?
 * CRITICAL - Establishes baseline for reduction calculation
 */
export default function Question5() {
  const { answers, setAnswer } = useSurvey();
  const selectedAmount = answers.q5_dailyAmount || 100;
  const smokeType = answers.q1_type || 'vapear';
  const unit = smokeType === 'fumar' ? 'cigarros' : 'caladas';

  const handleChange = (value: number | string) => {
    setAnswer('q5_dailyAmount', Number(value));
  };

  // Generate values: 10-200 in steps of 10, then 200-400 in steps of 50
  const generateValues = (): number[] => {
    const values: number[] = [];

    // 10 to 200, step 10
    for (let i = 10; i <= 200; i += 10) {
      values.push(i);
    }

    // 200 to 400, step 50
    for (let i = 250; i <= 400; i += 50) {
      values.push(i);
    }

    return values;
  };

  const values = generateValues();

  const formatter = (value: number | string) => {
    return String(value);
  };

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-4 leading-tight">
        ¿Cuántas {unit}
        <br />
        consumes al día?
      </h1>

      {/* Subtitle / Helper Text */}
      <p className="text-gray-400 text-center mb-12">
        {smokeType === 'fumar' ? '1 cigarro = 10 caladas' : ''}
      </p>

      {/* Picker Wheel */}
      <div className="mb-8">
        <PickerWheel
          values={values}
          selectedValue={selectedAmount}
          onChange={handleChange}
          formatter={formatter}
        />
      </div>
    </div>
  );
}
