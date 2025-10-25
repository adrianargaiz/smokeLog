import { useCigaretteCount } from '@/hooks/useCigaretteCount';
import { TrendingDown, TrendingUp, Minus as MinusIcon } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getDailyLog } from '@/lib/database';
import { format, subDays } from 'date-fns';

export default function DailyProgress() {
  const {
    todayCount,
    todayGoal,
    progressPercentage,
    progressStatus
  } = useCigaretteCount();

  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  const yesterdayLog = useLiveQuery(async () => {
    try {
      return await getDailyLog(yesterday);
    } catch (err) {
      console.error('Error fetching yesterday log:', err);
      return undefined;
    }
  }, [yesterday]);

  const yesterdayCount = yesterdayLog?.count ?? 0;
  const comparisonWithYesterday = todayCount - yesterdayCount;

  const statusColor =
    progressStatus === 'good'
      ? 'bg-green-500'
      : progressStatus === 'warning'
      ? 'bg-yellow-500'
      : 'bg-red-500';

  const statusText =
    progressStatus === 'good'
      ? 'Vas bien'
      : progressStatus === 'warning'
      ? 'Cerca del límite'
      : 'Límite superado';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Progreso del día
      </h2>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{statusText}</span>
          <span className="font-semibold">
            {Math.min(progressPercentage, 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${statusColor}`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{todayCount}</div>
          <div className="text-sm text-gray-600">Hoy</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{todayGoal}</div>
          <div className="text-sm text-gray-600">Objetivo</div>
        </div>
      </div>

      {/* Comparación con ayer */}
      {yesterdayCount > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            {comparisonWithYesterday < 0 ? (
              <>
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-semibold">
                  {Math.abs(comparisonWithYesterday)} menos que ayer
                </span>
              </>
            ) : comparisonWithYesterday > 0 ? (
              <>
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">
                  {comparisonWithYesterday} más que ayer
                </span>
              </>
            ) : (
              <>
                <MinusIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-semibold">
                  Igual que ayer
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
