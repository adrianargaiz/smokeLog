import { useStatistics } from '@/hooks/useStatistics';
import { TrendingDown, TrendingUp, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function StatisticsCard() {
  const { statistics, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const {
    weeklyAverage,
    totalThisWeek,
    bestDay,
    streak,
    comparisonWithYesterday
  } = statistics;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Estadísticas
      </h2>

      <div className="space-y-4">
        {/* Promedio semanal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Promedio semanal</span>
          </div>
          <span className="text-xl font-bold text-gray-800">
            {weeklyAverage.toFixed(1)}
          </span>
        </div>

        {/* Total esta semana */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Total esta semana</span>
          <span className="text-xl font-bold text-gray-800">
            {totalThisWeek}
          </span>
        </div>

        {/* Mejor día */}
        {bestDay && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Mejor día</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">
                {bestDay.count}
              </div>
              <div className="text-xs text-gray-600">
                {format(new Date(bestDay.date), 'EEE d MMM', { locale: es })}
              </div>
            </div>
          </div>
        )}

        {/* Racha */}
        {streak > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🔥</div>
              <span className="text-gray-700">Racha</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">
                {streak} {streak === 1 ? 'día' : 'días'}
              </div>
              <div className="text-xs text-gray-600">
                cumpliendo objetivo
              </div>
            </div>
          </div>
        )}

        {/* Tendencia vs ayer */}
        {comparisonWithYesterday !== 0 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
            {comparisonWithYesterday < 0 ? (
              <>
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-semibold">
                  Mejorando
                </span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">
                  Necesitas mejorar
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
