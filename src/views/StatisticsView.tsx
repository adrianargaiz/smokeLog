import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { getDailyLog, getAllDailyLogs } from '@/lib/database';

interface HourlyData {
  hour: number;
  count: number;
}

interface DailyData {
  date: string;
  count: number;
}

interface StatisticsViewProps {
  onNavigateToProfile?: () => void;
}

/**
 * StatisticsView - Statistics page with 3 charts (Day, Week, Month)
 */
export default function StatisticsView({ onNavigateToProfile }: StatisticsViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayData, setDayData] = useState<HourlyData[]>([]);
  const [weekData, setWeekData] = useState<DailyData[]>([]);
  const [monthData, setMonthData] = useState<DailyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDayStatistics = useCallback(async () => {
    // For now, create mock hourly data (0-23)
    // TODO: Implement actual hourly tracking in database
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const dailyLog = await getDailyLog(dateString);

    const hourlyData: HourlyData[] = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: 0
    }));

    // Distribute daily count across hours (mock data)
    if (dailyLog) {
      // For demo, put all count at hour 11
      hourlyData[11].count = dailyLog.count;
      console.log(`Day statistics loaded: ${dailyLog.count} at hour 11`);
    } else {
      console.log(`No daily log found for ${dateString}`);
    }

    setDayData(hourlyData);
  }, [currentDate]);

  const loadWeekStatistics = useCallback(async () => {
    const weekStart = startOfWeek(currentDate, { locale: es });
    const weekEnd = endOfWeek(currentDate, { locale: es });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const logs = await getAllDailyLogs();
    const logMap = new Map(logs.map(log => [log.date, log.count]));

    const weeklyData: DailyData[] = days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      count: logMap.get(format(day, 'yyyy-MM-dd')) || 0
    }));

    const totalCount = weeklyData.reduce((sum, d) => sum + d.count, 0);
    console.log(`Week statistics loaded: ${logs.length} total logs, ${totalCount} for this week`);

    setWeekData(weeklyData);
  }, [currentDate]);

  const loadMonthStatistics = useCallback(async () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const logs = await getAllDailyLogs();
    const logMap = new Map(logs.map(log => [log.date, log.count]));

    const monthlyData: DailyData[] = days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      count: logMap.get(format(day, 'yyyy-MM-dd')) || 0
    }));

    const totalCount = monthlyData.reduce((sum, d) => sum + d.count, 0);
    console.log(`Month statistics loaded: ${logs.length} total logs, ${totalCount} for this month`);

    setMonthData(monthlyData);
  }, [currentDate]);

  const loadStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadDayStatistics(),
        loadWeekStatistics(),
        loadMonthStatistics()
      ]);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadDayStatistics, loadWeekStatistics, loadMonthStatistics]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const navigatePreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const navigateNextDay = () => setCurrentDate(addDays(currentDate, 1));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#c8eef7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-smokelog-yellow-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col bg-[#c8eef7]">
      {/* Sky blue background */}

      {/* Sticky Header - Fixed at top */}
      <header className="relative z-50 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center justify-between w-full pt-4 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
            Estadísticas
          </h1>

          {/* User Profile Icon */}
          <button
            onClick={onNavigateToProfile}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/80 border-2 border-gray-300 shadow-md hover:bg-white active:scale-95 transition-all duration-200"
            aria-label="Ver perfil"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content Container - Scrollable, account for bottom nav */}
      <div
        className="relative z-10 flex-1 flex flex-col overflow-y-auto px-6"
        style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
      >

        {/* Day Chart */}
        <DayChart
          date={currentDate}
          data={dayData}
          onPrevious={navigatePreviousDay}
          onNext={navigateNextDay}
        />

        {/* Week Chart */}
        <WeekChart
          date={currentDate}
          data={weekData}
          onPrevious={() => setCurrentDate(subWeeks(currentDate, 1))}
          onNext={() => setCurrentDate(addWeeks(currentDate, 1))}
        />

        {/* Month Chart */}
        <MonthChart
          date={currentDate}
          data={monthData}
          onPrevious={() => setCurrentDate(subMonths(currentDate, 1))}
          onNext={() => setCurrentDate(addMonths(currentDate, 1))}
        />

      </div>
    </div>
  );
}

/**
 * Day Chart Component
 */
interface DayChartProps {
  date: Date;
  data: HourlyData[];
  onPrevious: () => void;
  onNext: () => void;
}

function DayChart({ date, data, onPrevious, onNext }: DayChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const nicotineMg = (total * 8) / 1000;
  const highUsageHours = data.filter(item => item.count > 0).length;

  const maxValue = Math.max(...data.map(d => d.count), 1);
  const hasData = total > 0;

  return (
    <div className="bg-white rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Day</h2>

      {/* Date Navigator */}
      <div className="flex items-center justify-center mb-6 gap-4">
        <button
          onClick={onPrevious}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Día anterior"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
          {format(date, 'd MMM yyyy', { locale: es })}
        </span>
        <button
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Día siguiente"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bar Chart or Empty State */}
      {hasData ? (
        <div className="mb-6">
          <div className="relative h-52 flex items-end justify-between gap-[2px] px-4 pb-8">
            {/* Y-axis grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-gray-200"></div>
              ))}
            </div>

            {/* Bars */}
            {data.map((item, index) => {
              const heightPercent = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
              const actualHeight = item.count > 0 ? Math.max(heightPercent, 3) : 0;
              const showLabel = index % 2 === 0;

              return (
                <div
                  key={item.hour}
                  className="flex-1 flex flex-col items-center justify-end h-full relative z-10"
                >
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full rounded-t-md transition-all duration-200"
                      style={{
                        height: `${actualHeight}%`,
                        backgroundColor: item.count > 0 ? '#5BA3D0' : 'transparent'
                      }}
                    />
                  </div>
                  {showLabel && (
                    <div className="absolute -bottom-6 text-xs text-gray-500">{item.hour}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 h-48 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center px-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 font-medium">No hay datos para este día</p>
            <p className="text-sm text-gray-500 mt-1">Comienza a registrar tu consumo</p>
          </div>
        </div>
      )}

      {/* Stats Summary - Clean design matching reference */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-400 mt-1">puffs total</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{nicotineMg.toFixed(2)} mg</div>
          <div className="text-sm text-gray-400 mt-1">nicotine</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{highUsageHours}</div>
          <div className="text-sm text-gray-400 mt-1">high usage</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Week Chart Component
 */
interface WeekChartProps {
  date: Date;
  data: DailyData[];
  onPrevious: () => void;
  onNext: () => void;
}

function WeekChart({ date, data, onPrevious, onNext }: WeekChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const nicotineMg = (total * 8) / 1000;
  const highUsageDays = data.filter(item => item.count > 0).length;

  const weekStart = startOfWeek(date, { locale: es });
  const weekEnd = endOfWeek(date, { locale: es });
  const maxValue = Math.max(...data.map(d => d.count), 1);
  const hasData = total > 0;

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Week</h2>

      {/* Date Navigator */}
      <div className="flex items-center justify-center mb-6 gap-4">
        <button
          onClick={onPrevious}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Semana anterior"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-900 min-w-[220px] text-center">
          {format(weekStart, 'MMM d', { locale: es })} - {format(weekEnd, 'MMM d, yyyy', { locale: es })}
        </span>
        <button
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Semana siguiente"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bar Chart or Empty State */}
      {hasData ? (
        <div className="mb-6">
          <div className="relative h-52 flex items-end justify-between gap-2 px-4 pb-8">
            {/* Y-axis grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-gray-200"></div>
              ))}
            </div>

            {/* Bars */}
            {data.map((item, index) => {
              const heightPercent = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
              const actualHeight = item.count > 0 ? Math.max(heightPercent, 3) : 0;

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center justify-end h-full relative z-10"
                >
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full rounded-t-lg transition-all duration-200"
                      style={{
                        height: `${actualHeight}%`,
                        backgroundColor: item.count > 0 ? '#5BA3D0' : 'transparent'
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-6 text-xs text-gray-500">
                    {dayLabels[index]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 h-48 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center px-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No hay datos para esta semana</p>
            <p className="text-sm text-gray-500 mt-1">Los datos aparecerán aquí cuando registres tu consumo</p>
          </div>
        </div>
      )}

      {/* Stats Summary - Clean design matching reference */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-400 mt-1">puffs total</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{nicotineMg.toFixed(2)} mg</div>
          <div className="text-sm text-gray-400 mt-1">nicotine</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{highUsageDays}</div>
          <div className="text-sm text-gray-400 mt-1">high usage</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Month Chart Component
 */
interface MonthChartProps {
  date: Date;
  data: DailyData[];
  onPrevious: () => void;
  onNext: () => void;
}

function MonthChart({ date, data, onPrevious, onNext }: MonthChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const nicotineMg = (total * 8) / 1000;
  const highUsageDays = data.filter(item => item.count > 0).length;

  const maxValue = Math.max(...data.map(d => d.count), 1);
  const hasData = total > 0;

  return (
    <div className="bg-white rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Month</h2>

      {/* Date Navigator */}
      <div className="flex items-center justify-center mb-6 gap-4">
        <button
          onClick={onPrevious}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-900 min-w-[180px] text-center capitalize">
          {format(date, 'MMMM yyyy', { locale: es })}
        </span>
        <button
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Mes siguiente"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bar Chart or Empty State */}
      {hasData ? (
        <div className="mb-6">
          <div className="relative h-52 flex items-end justify-between gap-[1px] px-4 pb-8">
            {/* Y-axis grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-gray-200"></div>
              ))}
            </div>

            {/* Bars */}
            {data.map((item, index) => {
              const heightPercent = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
              const actualHeight = item.count > 0 ? Math.max(heightPercent, 3) : 0;
              const showLabel = index % 3 === 0; // Show every 3rd day
              const dayNumber = new Date(item.date + 'T12:00:00').getDate();

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center justify-end h-full relative z-10"
                >
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full rounded-t transition-all duration-200"
                      style={{
                        height: `${actualHeight}%`,
                        backgroundColor: item.count > 0 ? '#5BA3D0' : 'transparent'
                      }}
                    />
                  </div>
                  {showLabel && (
                    <div className="absolute -bottom-6 text-xs text-gray-500">
                      {dayNumber}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 h-48 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center px-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No hay datos para este mes</p>
            <p className="text-sm text-gray-500 mt-1">Tus estadísticas mensuales se mostrarán aquí</p>
          </div>
        </div>
      )}

      {/* Stats Summary - Clean design matching reference */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-400 mt-1">puffs total</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{nicotineMg.toFixed(2)} mg</div>
          <div className="text-sm text-gray-400 mt-1">nicotine</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{highUsageDays}</div>
          <div className="text-sm text-gray-400 mt-1">high usage</div>
        </div>
      </div>
    </div>
  );
}
