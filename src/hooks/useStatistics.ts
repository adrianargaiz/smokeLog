import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format, subDays } from 'date-fns';
import type { Statistics, DailyLog } from '@/types';
import { getLastNDaysLogs, getDailyLog } from '@/lib/database';
import { DAYS_IN_WEEK, DAYS_IN_MONTH } from '@/lib/constants';

export interface UseStatisticsResult {
  statistics: Statistics;
  isLoading: boolean;
  weeklyLogs: DailyLog[];
  monthlyLogs: DailyLog[];
}

/**
 * Hook para calcular y obtener estadísticas del consumo
 */
export function useStatistics(): UseStatisticsResult {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Query reactiva para logs de la última semana
  const weeklyLogs = useLiveQuery(async () => {
    try {
      return await getLastNDaysLogs(DAYS_IN_WEEK);
    } catch (err) {
      console.error('Error fetching weekly logs:', err);
      return [];
    }
  }, []) ?? [];

  // Query reactiva para logs del último mes
  const monthlyLogs = useLiveQuery(async () => {
    try {
      return await getLastNDaysLogs(DAYS_IN_MONTH);
    } catch (err) {
      console.error('Error fetching monthly logs:', err);
      return [];
    }
  }, []) ?? [];

  // Query reactiva para log de ayer
  const yesterdayLog = useLiveQuery(async () => {
    try {
      return await getDailyLog(yesterday);
    } catch (err) {
      console.error('Error fetching yesterday log:', err);
      return undefined;
    }
  }, [yesterday]);

  // Query reactiva para log de hoy
  const todayLog = useLiveQuery(async () => {
    try {
      return await getDailyLog(today);
    } catch (err) {
      console.error('Error fetching today log:', err);
      return undefined;
    }
  }, [today]);

  // Calcular estadísticas usando useMemo para evitar recalcular innecesariamente
  const statistics: Statistics = useMemo(() => {
    // Total y promedio semanal
    const totalThisWeek = weeklyLogs.reduce((sum, log) => sum + log.count, 0);
    const weeklyAverage = weeklyLogs.length > 0 ? totalThisWeek / weeklyLogs.length : 0;

    // Total y promedio mensual
    const totalThisMonth = monthlyLogs.reduce((sum, log) => sum + log.count, 0);
    const monthlyAverage = monthlyLogs.length > 0 ? totalThisMonth / monthlyLogs.length : 0;

    // Mejor día (menos cigarrillos)
    let bestDay: Statistics['bestDay'] = null;
    if (weeklyLogs.length > 0) {
      const sortedAsc = [...weeklyLogs].sort((a, b) => a.count - b.count);
      const best = sortedAsc[0];
      if (best) {
        bestDay = {
          date: best.date,
          count: best.count
        };
      }
    }

    // Peor día (más cigarrillos)
    let worstDay: Statistics['worstDay'] = null;
    if (weeklyLogs.length > 0) {
      const sortedDesc = [...weeklyLogs].sort((a, b) => b.count - a.count);
      const worst = sortedDesc[0];
      if (worst) {
        worstDay = {
          date: worst.date,
          count: worst.count
        };
      }
    }

    // Comparación con ayer
    const todayCount = todayLog?.count ?? 0;
    const yesterdayCount = yesterdayLog?.count ?? 0;
    const comparisonWithYesterday = todayCount - yesterdayCount;

    // Comparación con semana pasada (mismo día de la semana)
    const lastWeekSameDayLog = weeklyLogs.find((log) => {
      const logDate = new Date(log.date);
      const todayDate = new Date(today);
      return logDate.getDay() === todayDate.getDay() && log.date !== today;
    });
    const lastWeekCount = lastWeekSameDayLog?.count ?? 0;
    const comparisonWithLastWeek = todayCount - lastWeekCount;

    // Calcular racha de días cumpliendo objetivo
    let streak = 0;
    const sortedLogs = [...weeklyLogs].sort((a, b) => b.date.localeCompare(a.date));

    for (const log of sortedLogs) {
      if (log.count <= log.goal) {
        streak++;
      } else {
        break;
      }
    }

    return {
      weeklyAverage: parseFloat(weeklyAverage.toFixed(1)),
      monthlyAverage: parseFloat(monthlyAverage.toFixed(1)),
      totalThisWeek,
      totalThisMonth,
      bestDay,
      worstDay,
      comparisonWithYesterday,
      comparisonWithLastWeek,
      streak
    };
  }, [weeklyLogs, monthlyLogs, todayLog, yesterdayLog, today]);

  const isLoading = weeklyLogs === undefined || monthlyLogs === undefined;

  return {
    statistics,
    isLoading,
    weeklyLogs,
    monthlyLogs
  };
}
