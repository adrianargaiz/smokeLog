import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { getDailyLog, getAllDailyLogs } from '@/lib/database';
import { getSurveyAnswers, getMeasurementUnit } from '@/utils/surveyHelpers';

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

  const surveyAnswers = getSurveyAnswers();
  const unit = getMeasurementUnit(surveyAnswers);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-smokelog-blue-soft to-smokelog-blue-pale">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-smokelog-yellow-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden fixed inset-0 flex flex-col bg-white">
      {/* Branded Background Image - matching HomeView */}
      <div
        className="absolute inset-0 -top-20 opacity-80"
        style={{
          backgroundImage: 'url(/nuevo-fondo.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-6 pb-24 pt-safe">

        {/* Header */}
        <header className="flex items-center justify-between pt-6 pb-6 relative z-30 sticky top-0 bg-transparent">
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
        </header>

        {/* Day Chart */}
        <DayChart
          date={currentDate}
          data={dayData}
          onPrevious={navigatePreviousDay}
          onNext={navigateNextDay}
          unit={unit}
        />

        {/* Week Chart */}
        <WeekChart
          date={currentDate}
          data={weekData}
          onPrevious={() => setCurrentDate(subWeeks(currentDate, 1))}
          onNext={() => setCurrentDate(addWeeks(currentDate, 1))}
          unit={unit}
        />

        {/* Month Chart */}
        <MonthChart
          date={currentDate}
          data={monthData}
          onPrevious={() => setCurrentDate(subMonths(currentDate, 1))}
          onNext={() => setCurrentDate(addMonths(currentDate, 1))}
          unit={unit}
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
  unit: string;
}

function DayChart({ date, data, onPrevious, onNext, unit }: DayChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const nicotineMg = (total * 8) / 1000;
  const avgPerHour = total > 0 ? (total / 24).toFixed(1) : '0';

  const maxValue = Math.max(...data.map(d => d.count), 1);
  const hasData = total > 0;

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Día</h2>

      {/* Date Navigator */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrevious}
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Día anterior"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xl font-semibold text-gray-800">
          {format(date, 'd MMM yyyy', { locale: es })}
        </span>
        <button
          onClick={onNext}
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Día siguiente"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bar Chart or Empty State */}
      {hasData ? (
        <div className="mb-6">
          <div className="flex items-end justify-between gap-1 h-48 pb-8 relative">
            {data.map((item, index) => {
              const heightPercent = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
              const minHeight = 2; // Minimum 2% height for visibility
              const actualHeight = item.count > 0 ? Math.max(heightPercent, minHeight) : 0;
              const showLabel = index % 3 === 0; // Show every 3rd hour

              return (
                <div
                  key={item.hour}
                  className="flex-1 flex flex-col items-center justify-end h-full relative"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onTouchStart={() => setHoveredBar(index)}
                  onTouchEnd={() => setTimeout(() => setHoveredBar(null), 2000)}
                >
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className={`w-full rounded-t transition-all duration-200 ${
                        item.count > 0
                          ? 'bg-smokelog-yellow-golden hover:bg-smokelog-yellow-bright cursor-pointer'
                          : 'bg-gray-200'
                      }`}
                      style={{ height: `${actualHeight}%` }}
                      title={`${item.hour}:00 - ${item.count} ${unit}`}
                    />
                  </div>
                  {showLabel && (
                    <div className="text-xs text-gray-600 mt-2 font-medium">{item.hour}</div>
                  )}

                  {/* Tooltip on hover/touch */}
                  {hoveredBar === index && item.count > 0 && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 shadow-lg">
                      {item.hour}:00 - {item.count} {unit}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 font-medium">No hay datos para este día</p>
            <p className="text-sm text-gray-500 mt-1">Comienza a registrar tu consumo</p>
          </div>
        </div>
      )}

      {/* Stats Summary - Differentiated design for Day */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center bg-smokelog-blue-pale rounded-lg p-3">
          <div className="text-xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-600">{unit} total</div>
        </div>
        <div className="text-center bg-smokelog-yellow-cream rounded-lg p-3">
          <div className="text-xl font-bold text-gray-900">{nicotineMg.toFixed(2)} mg</div>
          <div className="text-sm text-gray-600">nicotina</div>
        </div>
        <div className="text-center bg-smokelog-blue-pale rounded-lg p-3">
          <div className="text-xl font-bold text-gray-900">{avgPerHour}</div>
          <div className="text-sm text-gray-600">promedio/hora</div>
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
  unit: string;
}

function WeekChart({ date, data, onPrevious, onNext, unit }: WeekChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const nicotineMg = (total * 8) / 1000;
  const avgPerDay = total > 0 ? (total / 7).toFixed(1) : '0';

  const weekStart = startOfWeek(date, { locale: es });
  const weekEnd = endOfWeek(date, { locale: es });
  const maxValue = Math.max(...data.map(d => d.count), 1);
  const hasData = total > 0;

  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Semana</h2>

      {/* Date Navigator */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrevious}
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Semana anterior"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xl font-semibold text-gray-800">
          {format(weekStart, 'MMM d', { locale: es })} - {format(weekEnd, 'MMM d, yyyy', { locale: es })}
        </span>
        <button
          onClick={onNext}
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Semana siguiente"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bar Chart or Empty State */}
      {hasData ? (
        <div className="mb-6">
          <div className="flex items-end justify-between gap-3 h-48 pb-8 relative">
            {data.map((item, index) => {
              const heightPercent = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
              const minHeight = 2;
              const actualHeight = item.count > 0 ? Math.max(heightPercent, minHeight) : 0;
              const itemDate = new Date(item.date + 'T12:00:00');
              const isTodayDate = isToday(itemDate);

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center justify-end h-full relative"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onTouchStart={() => setHoveredBar(index)}
                  onTouchEnd={() => setTimeout(() => setHoveredBar(null), 2000)}
                >
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-200 ${
                        isTodayDate && item.count > 0
                          ? 'bg-smokelog-yellow-bright hover:bg-smokelog-yellow-golden cursor-pointer ring-2 ring-smokelog-yellow-golden'
                          : item.count > 0
                          ? 'bg-smokelog-blue-light hover:bg-smokelog-blue-soft cursor-pointer'
                          : 'bg-gray-200'
                      }`}
                      style={{ height: `${actualHeight}%` }}
                      title={`${dayLabels[index]} - ${item.count} ${unit}`}
                    />
                  </div>
                  <div className={`text-sm mt-2 font-medium ${isTodayDate ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                    {dayLabels[index]}
                  </div>

                  {/* Tooltip */}
                  {hoveredBar === index && item.count > 0 && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 shadow-lg">
                      {dayLabels[index]} - {item.count} {unit}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No hay datos para esta semana</p>
            <p className="text-sm text-gray-500 mt-1">Los datos aparecerán aquí cuando registres tu consumo</p>
          </div>
        </div>
      )}

      {/* Stats Summary - Differentiated design for Week */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center bg-smokelog-blue-soft rounded-lg p-3 border border-smokelog-blue-light">
          <div className="text-xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-600">{unit} total</div>
        </div>
        <div className="text-center bg-smokelog-yellow-cream rounded-lg p-3 border border-smokelog-yellow-golden">
          <div className="text-xl font-bold text-gray-900">{nicotineMg.toFixed(2)} mg</div>
          <div className="text-sm text-gray-600">nicotina</div>
        </div>
        <div className="text-center bg-smokelog-blue-soft rounded-lg p-3 border border-smokelog-blue-light">
          <div className="text-xl font-bold text-gray-900">{avgPerDay}</div>
          <div className="text-sm text-gray-600">promedio/día</div>
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
  unit: string;
}

function MonthChart({ date, data, onPrevious, onNext, unit }: MonthChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const nicotineMg = (total * 8) / 1000;
  const daysInMonth = data.length;
  const avgPerDay = total > 0 ? (total / daysInMonth).toFixed(1) : '0';

  const maxValue = Math.max(...data.map(d => d.count), 1);
  const hasData = total > 0;
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Mes</h2>

      {/* Date Navigator */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrevious}
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Mes anterior"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xl font-semibold text-gray-800 capitalize">
          {format(date, 'MMMM yyyy', { locale: es })}
        </span>
        <button
          onClick={onNext}
          className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Mes siguiente"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bar Chart or Empty State */}
      {hasData ? (
        <div className="mb-6">
          <div className="flex items-end justify-between gap-0.5 h-48 pb-8 relative">
            {data.map((item, index) => {
              const heightPercent = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
              const minHeight = 2;
              const actualHeight = item.count > 0 ? Math.max(heightPercent, minHeight) : 0;
              const showLabel = index % 3 === 0; // Show every 3rd day to avoid crowding
              const dayNumber = new Date(item.date + 'T12:00:00').getDate();
              const itemDate = new Date(item.date + 'T12:00:00');
              const isTodayDate = isToday(itemDate);

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center justify-end h-full relative"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onTouchStart={() => setHoveredBar(index)}
                  onTouchEnd={() => setTimeout(() => setHoveredBar(null), 2000)}
                >
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className={`w-full rounded-t transition-all duration-200 ${
                        isTodayDate && item.count > 0
                          ? 'bg-smokelog-yellow-bright hover:bg-smokelog-yellow-golden cursor-pointer ring-2 ring-smokelog-yellow-golden'
                          : item.count > 0
                          ? 'bg-smokelog-blue-light hover:bg-smokelog-blue-soft cursor-pointer'
                          : 'bg-gray-200'
                      }`}
                      style={{ height: `${actualHeight}%` }}
                      title={`Día ${dayNumber} - ${item.count} ${unit}`}
                    />
                  </div>
                  {showLabel && (
                    <div className={`text-xs mt-2 font-medium ${isTodayDate ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                      {dayNumber}
                    </div>
                  )}

                  {/* Tooltip */}
                  {hoveredBar === index && item.count > 0 && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 shadow-lg">
                      Día {dayNumber} - {item.count} {unit}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
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

      {/* Stats Summary - Differentiated design for Month */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center bg-gradient-to-br from-smokelog-blue-soft to-smokelog-blue-light rounded-lg p-3 shadow-sm">
          <div className="text-xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-600">{unit} total</div>
        </div>
        <div className="text-center bg-gradient-to-br from-smokelog-yellow-cream to-smokelog-yellow-golden rounded-lg p-3 shadow-sm">
          <div className="text-xl font-bold text-gray-900">{nicotineMg.toFixed(2)} mg</div>
          <div className="text-sm text-gray-600">nicotina</div>
        </div>
        <div className="text-center bg-gradient-to-br from-smokelog-blue-soft to-smokelog-blue-light rounded-lg p-3 shadow-sm">
          <div className="text-xl font-bold text-gray-900">{avgPerDay}</div>
          <div className="text-sm text-gray-600">promedio/día</div>
        </div>
      </div>
    </div>
  );
}
