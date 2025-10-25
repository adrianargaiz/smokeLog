import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import type { DailyLog, ProgressStatus } from '@/types';
import { getDailyLog, upsertDailyLog, getSettings } from '@/lib/database';
import { PROGRESS_THRESHOLD_WARNING, PROGRESS_THRESHOLD_EXCEEDED } from '@/lib/constants';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface UseCigaretteCountResult {
  todayCount: number;
  todayGoal: number;
  todayLog: DailyLog | undefined;
  progressStatus: ProgressStatus;
  progressPercentage: number;
  canDecrement: boolean;
  isLoading: boolean;
  addCigarette: () => Promise<void>;
  removeCigarette: () => Promise<void>;
  resetToday: () => Promise<void>;
  setCount: (count: number) => Promise<void>;
}

/**
 * Hook para gestionar el contador de cigarrillos del día actual
 */
export function useCigaretteCount(): UseCigaretteCountResult {
  const [isLoading, setIsLoading] = useState(false);
  const [todayGoal, setTodayGoal] = useState(20);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Query reactiva para el log de hoy
  const todayLog = useLiveQuery(async () => {
    try {
      return await getDailyLog(today);
    } catch (err) {
      console.error('Error fetching today log:', err);
      return undefined;
    }
  }, [today]);

  // Obtener el objetivo actual de settings
  useEffect(() => {
    const loadGoal = async () => {
      try {
        const settings = await getSettings();
        setTodayGoal(settings.dailyGoal);
      } catch (err) {
        console.error('Error loading goal:', err);
      }
    };

    loadGoal();
  }, []);

  const todayCount = todayLog?.count ?? 0;

  // Calcular porcentaje de progreso
  const progressPercentage = todayGoal > 0 ? (todayCount / todayGoal) * 100 : 0;

  // Determinar estado de progreso
  const progressStatus: ProgressStatus =
    progressPercentage >= PROGRESS_THRESHOLD_EXCEEDED * 100
      ? 'exceeded'
      : progressPercentage >= PROGRESS_THRESHOLD_WARNING * 100
      ? 'warning'
      : 'good';

  const canDecrement = todayCount > 0;

  // Feedback háptico en móvil
  const triggerHaptic = useCallback(async (style: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style });
    } catch (err) {
      // Haptics no disponible en web, ignorar
    }
  }, []);

  // Añadir un cigarrillo
  const addCigarette = useCallback(async () => {
    try {
      setIsLoading(true);

      const newCount = todayCount + 1;
      const timestamp = Date.now();

      await upsertDailyLog({
        date: today,
        count: newCount,
        goal: todayGoal,
        timestamp,
        notes: todayLog?.notes
      });

      // Feedback háptico diferente según estado
      if (newCount >= todayGoal) {
        await triggerHaptic(ImpactStyle.Heavy); // Vibracion fuerte si excede
      } else {
        await triggerHaptic(ImpactStyle.Light); // Vibracion suave
      }
    } catch (err) {
      console.error('Error adding cigarette:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [today, todayCount, todayGoal, todayLog, triggerHaptic]);

  // Remover un cigarrillo
  const removeCigarette = useCallback(async () => {
    if (!canDecrement) return;

    try {
      setIsLoading(true);

      const newCount = Math.max(0, todayCount - 1);
      const timestamp = Date.now();

      await upsertDailyLog({
        date: today,
        count: newCount,
        goal: todayGoal,
        timestamp,
        notes: todayLog?.notes
      });

      await triggerHaptic(ImpactStyle.Light);
    } catch (err) {
      console.error('Error removing cigarette:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [today, todayCount, todayGoal, todayLog, canDecrement, triggerHaptic]);

  // Resetear contador del día a 0
  const resetToday = useCallback(async () => {
    try {
      setIsLoading(true);

      const timestamp = Date.now();

      await upsertDailyLog({
        date: today,
        count: 0,
        goal: todayGoal,
        timestamp,
        notes: todayLog?.notes
      });

      await triggerHaptic(ImpactStyle.Medium);
    } catch (err) {
      console.error('Error resetting today:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [today, todayGoal, todayLog, triggerHaptic]);

  // Establecer contador a un valor específico
  const setCount = useCallback(async (count: number) => {
    if (count < 0) return;

    try {
      setIsLoading(true);

      const timestamp = Date.now();

      await upsertDailyLog({
        date: today,
        count,
        goal: todayGoal,
        timestamp,
        notes: todayLog?.notes
      });

      await triggerHaptic(ImpactStyle.Light);
    } catch (err) {
      console.error('Error setting count:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [today, todayGoal, todayLog, triggerHaptic]);

  return {
    todayCount,
    todayGoal,
    todayLog,
    progressStatus,
    progressPercentage,
    canDecrement,
    isLoading,
    addCigarette,
    removeCigarette,
    resetToday,
    setCount
  };
}
