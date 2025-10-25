import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { DailyLog, TimePeriod } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistoryChartProps {
  logs: DailyLog[];
  period: TimePeriod;
  goal?: number;
}

export default function HistoryChart({ logs, period, goal = 20 }: HistoryChartProps) {
  const chartData = useMemo(() => {
    // Ordenar logs por fecha (más reciente al final para el gráfico)
    const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

    // Tomar solo los logs según el período
    const limit = period === '7days' ? 7 : period === '30days' ? 30 : logs.length;
    const limitedLogs = sortedLogs.slice(-limit);

    return limitedLogs.map(log => ({
      date: format(new Date(log.date), 'dd/MM', { locale: es }),
      fullDate: log.date,
      count: log.count,
      goal: log.goal,
      exceedsGoal: log.count > log.goal
    }));
  }, [logs, period]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-12">
          No hay datos para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Historial
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: number) => [`${value} cigarrillos`, 'Cantidad']}
          />
          <ReferenceLine
            y={goal}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: 'Objetivo', position: 'right', fill: '#f59e0b', fontSize: 12 }}
          />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            onClick={(data) => {
              console.log('Clicked:', data);
            }}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-700">Cigarrillos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-yellow-500 rounded"></div>
          <span className="text-gray-700">Objetivo</span>
        </div>
      </div>
    </div>
  );
}
