import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useCigaretteCount } from '@/hooks/useCigaretteCount';

export default function Counter() {
  const {
    todayCount,
    todayGoal,
    progressStatus,
    canDecrement,
    isLoading,
    addCigarette,
    removeCigarette,
    resetToday
  } = useCigaretteCount();

  const handleReset = async () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el contador de hoy?')) {
      await resetToday();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      {/* Contador principal */}
      <div className="relative">
        <div
          className={`
          w-48 h-48 rounded-full flex items-center justify-center
          border-8 transition-colors duration-300
          ${
            progressStatus === 'good'
              ? 'border-green-500 bg-green-50'
              : progressStatus === 'warning'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-red-500 bg-red-50'
          }
        `}
        >
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-800">{todayCount}</div>
            <div className="text-sm text-gray-600 mt-1">
              de {todayGoal} al día
            </div>
          </div>
        </div>
      </div>

      {/* Botón principal +1 */}
      <button
        onClick={addCigarette}
        disabled={isLoading}
        className="
          w-32 h-32 rounded-full
          bg-primary hover:bg-primary/90
          text-white text-2xl font-bold
          shadow-lg hover:shadow-xl
          transition-all duration-200
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center
        "
      >
        <Plus className="w-12 h-12" />
      </button>

      {/* Botones secundarios */}
      <div className="flex gap-4">
        <button
          onClick={removeCigarette}
          disabled={!canDecrement || isLoading}
          className="
            w-14 h-14 rounded-full
            bg-gray-200 hover:bg-gray-300
            text-gray-700
            shadow hover:shadow-md
            transition-all duration-200
            active:scale-95
            disabled:opacity-30 disabled:cursor-not-allowed
            flex items-center justify-center
          "
          title="Restar uno"
        >
          <Minus className="w-6 h-6" />
        </button>

        <button
          onClick={handleReset}
          disabled={todayCount === 0 || isLoading}
          className="
            w-14 h-14 rounded-full
            bg-gray-200 hover:bg-gray-300
            text-gray-700
            shadow hover:shadow-md
            transition-all duration-200
            active:scale-95
            disabled:opacity-30 disabled:cursor-not-allowed
            flex items-center justify-center
          "
          title="Reiniciar"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
