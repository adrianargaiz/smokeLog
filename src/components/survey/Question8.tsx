import { useSurvey } from '../../hooks/useSurvey';
import PickerWheel from './PickerWheel';

/**
 * Question 8: ¿Cuánto te gastas en un mes?
 * Final question - collects monthly spending data
 */
export default function Question8() {
  const { answers, setAnswer } = useSurvey();
  const selectedSpending = answers.q8_monthlySpending || 100;

  const handleChange = (value: number | string) => {
    setAnswer('q8_monthlySpending', Number(value));
  };

  // Values: 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000+
  const values = [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000];

  const formatter = (value: number | string) => {
    const num = Number(value);
    if (num >= 1000) {
      return '€1000+';
    }
    return `€${value}`;
  };

  return (
    <div className="px-6 pt-12 pb-32">
      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12 leading-tight">
        ¿Cuánto te gastas
        <br />
        en un mes?
      </h1>

      {/* Picker Wheel */}
      <div className="mb-8">
        <PickerWheel
          values={values}
          selectedValue={selectedSpending}
          onChange={handleChange}
          formatter={formatter}
        />
      </div>
    </div>
  );
}
