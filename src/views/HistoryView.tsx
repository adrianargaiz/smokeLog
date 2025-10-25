import { useState } from 'react';
import type { TimePeriod, DailyLog } from '@/types';
import { useDatabase } from '@/hooks/useDatabase';
import HistoryChart from '@/components/HistoryChart';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

export default function HistoryView() {
  const [period, setPeriod] = useState<TimePeriod>('7days');
  const { dailyLogs, settings } = useDatabase();

  const filteredLogs = dailyLogs.slice(0, period === '7days' ? 7 : period === '30days' ? 30 : dailyLogs.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-6 px-4 shadow-md">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Historial</h1>
          <p className="text-blue-100 text-sm mt-1">
            Visualiza tu progreso
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Period selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('7days')}
            className={`
              flex-1 py-2 px-4 rounded-lg font-semibold
              transition-colors duration-200
              ${period === '7days'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300'
              }
            `}
          >
            7 días
          </button>
          <button
            onClick={() => setPeriod('30days')}
            className={`
              flex-1 py-2 px-4 rounded-lg font-semibold
              transition-colors duration-200
              ${period === '30days'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300'
              }
            `}
          >
            30 días
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`
              flex-1 py-2 px-4 rounded-lg font-semibold
              transition-colors duration-200
              ${period === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300'
              }
            `}
          >
            Todo
          </button>
        </div>

        {/* Chart */}
        <HistoryChart
          logs={filteredLogs}
          period={period}
          goal={settings?.dailyGoal}
        />

        {/* Recent Days List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Últimos días
          </h2>

          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay datos registrados
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.slice(0, 10).map((log: DailyLog) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-800 capitalize">
                        {format(new Date(log.date), "EEEE, d 'de' MMM", { locale: es })}
                      </div>
                      <div className="text-xs text-gray-600">
                        Objetivo: {log.goal}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        log.count <= log.goal
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {log.count}
                    </div>
                    {log.count <= log.goal ? (
                      <div className="text-xs text-green-600">✓ Cumplido</div>
                    ) : (
                      <div className="text-xs text-red-600">
                        +{log.count - log.goal}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
