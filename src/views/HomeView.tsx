import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CounterCircle from '@/components/CounterCircle';
import { getDailyLog, upsertDailyLog, getSettings } from '@/lib/database';
import {
  getMeasurementUnit,
  calculateDailyTarget,
  getSurveyAnswers,
} from '@/utils/surveyHelpers';

interface HomeViewProps {
  onNavigateToHistory?: () => void;
  onNavigateToProfile?: () => void;
}

/**
 * HomeView - Main counter page for SmokeLOG
 *
 * Features:
 * - Date display at top
 * - Large clickable counter circle (primary interaction)
 * - Goal status message (on track / over goal)
 * - Decrement and Reset buttons
 * - "See past days" button
 * - Sky background matching WelcomeView
 * - Integration with survey data for personalization
 * - Real-time database sync
 */
export default function HomeView({ onNavigateToHistory, onNavigateToProfile }: HomeViewProps) {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const today = new Date();
  const dateString = format(today, 'yyyy-MM-dd');
  const formattedDate = format(today, "EEEE, d MMM", { locale: es });

  // Get measurement unit from survey
  const surveyAnswers = getSurveyAnswers();
  const unit = getMeasurementUnit(surveyAnswers);

  // Load data on mount
  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      setIsLoading(true);

      // Get start date from settings to calculate current day
      const settings = await getSettings();
      const startDate = new Date(settings.startDate);
      const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Calculate target for today
      const dailyTarget = calculateDailyTarget(daysDiff, 90, surveyAnswers);
      setTarget(dailyTarget);

      // Get today's log
      const todayLog = await getDailyLog(dateString);
      if (todayLog) {
        setCount(todayLog.count);
      } else {
        // Initialize today's log
        await upsertDailyLog({
          date: dateString,
          count: 0,
          goal: dailyTarget,
          timestamp: today.getTime(),
        });
        setCount(0);
      }
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCount = async (newCount: number) => {
    try {
      await upsertDailyLog({
        date: dateString,
        count: newCount,
        goal: target,
        timestamp: today.getTime(),
      });
    } catch (error) {
      console.error('Error saving count:', error);
    }
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    saveCount(newCount);
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      saveCount(newCount);
    }
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setCount(0);
    saveCount(0);
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  // Determine goal status
  const getGoalStatus = () => {
    if (count <= target) {
      return {
        message: '¡Estás dentro de tu objetivo!',
        subtitle: 'Sigue así, vas muy bien',
        color: 'text-[#3b82f6]', // Darker blue for better visibility
      };
    } else if (count <= target * 1.2) {
      return {
        message: 'Has superado tu objetivo',
        subtitle: 'Intenta reducir un poco más',
        color: 'text-yellow-600',
      };
    } else {
      return {
        message: 'Has superado tu objetivo',
        subtitle: 'No te desanimes, mañana será mejor',
        color: 'text-orange-600',
      };
    }
  };

  const goalStatus = getGoalStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-smokelog-blue-soft to-smokelog-blue-pale">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-smokelog-yellow-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden fixed inset-0 flex flex-col bg-white">
      {/* New Background Image - Extended to cover status bar area */}
      <div
        className="absolute inset-0 -top-20 opacity-80"
        style={{
          backgroundImage: 'url(/nuevo-fondo.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content Container - Must use h-full not h-screen */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden px-6 pb-24 pt-safe">
        {/* Header - Date left, User icon right - High z-index to ensure visibility */}
        <header className="flex items-center justify-between pt-6 pb-2 relative z-30">
          {/* Left: Date */}
          <h1 className="text-3xl font-extrabold text-gray-900 capitalize drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
            {formattedDate}
          </h1>

          {/* Right: User Profile Icon */}
          <button
            onClick={onNavigateToProfile}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/80 border-2 border-gray-300 shadow-md hover:bg-white active:scale-95 transition-all duration-200"
            aria-label="Ver perfil"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </header>

        {/* Main Counter Circle */}
        <div className="flex-1 flex items-center justify-center">
          <CounterCircle
            count={count}
            target={target}
            unit={unit}
            onClick={handleIncrement}
          />
        </div>

        {/* Goal Status Message */}
        <div className="text-center mb-4 animate-fade-in">
          <p className={`text-xl font-bold ${goalStatus.color} mb-1`}>
            {goalStatus.message}
          </p>
          <p className="text-sm text-gray-600">
            {goalStatus.subtitle}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {/* Decrement Button */}
          <button
            onClick={handleDecrement}
            disabled={count === 0}
            className={`flex items-center justify-center w-24 h-24 rounded-2xl shadow-lg transition-all duration-200 ${
              count === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-smokelog-blue-light text-gray-700 hover:bg-opacity-90 active:scale-95'
            }`}
            aria-label="Quitar uno"
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
              </svg>
              <span className="text-sm font-semibold">Quitar</span>
            </div>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-24 h-24 bg-smokelog-blue-light text-gray-700 rounded-2xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all duration-200"
            aria-label="Resetear contador"
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm font-semibold">Resetear</span>
            </div>
          </button>
        </div>

        {/* See Past Days Button - Smaller, matching action button style */}
        <div className="flex justify-center mb-6">
          <button
            onClick={onNavigateToHistory}
            className="border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 font-medium py-2 px-6 rounded-xl shadow-md hover:bg-white hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            Ver días anteriores
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Resetear contador?
            </h3>
            <p className="text-gray-600 mb-6">
              Esto pondrá el contador de hoy a cero. Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelReset}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-300 active:scale-[0.98] transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 bg-red-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all duration-200"
              >
                Resetear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
