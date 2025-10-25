import { useState } from 'react';
import { Target, Save } from 'lucide-react';
import { useDatabase } from '@/hooks/useDatabase';

export default function GoalSetting() {
  const { settings, updateSettings } = useDatabase();
  const [tempGoal, setTempGoal] = useState(settings?.dailyGoal.toString() ?? '20');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    const goalValue = parseInt(tempGoal);

    if (isNaN(goalValue) || goalValue < 1 || goalValue > 100) {
      setMessage('El objetivo debe estar entre 1 y 100');
      return;
    }

    try {
      setIsSaving(true);
      setMessage('');
      await updateSettings({ dailyGoal: goalValue });
      setMessage('Objetivo actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating goal:', error);
      setMessage('Error al guardar el objetivo');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanged = tempGoal !== settings?.dailyGoal.toString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Objetivo Diario
        </h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Establece cuántos cigarrillos quieres fumar como máximo al día
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
            Cigarrillos por día
          </label>
          <input
            id="goal"
            type="number"
            min="1"
            max="100"
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
            className="
              w-full px-4 py-3 text-lg
              border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              text-center font-semibold
            "
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanged || isSaving}
          className="
            w-full py-3 px-4
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold rounded-lg
            shadow hover:shadow-md
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Guardando...' : 'Guardar Objetivo'}
        </button>

        {message && (
          <div
            className={`
              text-center text-sm py-2 px-4 rounded-lg
              ${message.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
              }
            `}
          >
            {message}
          </div>
        )}

        <div className="text-center text-xs text-gray-500 mt-4">
          Objetivo actual: {settings?.dailyGoal} cigarrillos/día
        </div>
      </div>
    </div>
  );
}
