import { useState, useEffect, useRef } from 'react';
import { getSettings, getAllDailyLogs } from '@/lib/database';
import {
  getCurrentPlanDay,
  calculateTotalMoneySaved,
  calculateStreakDays,
  getDailyPlanTargets,
  getProgressChartData,
  getSurveyAnswers,
  getMeasurementUnit,
} from '@/utils/surveyHelpers';

interface DayPlanData {
  day: number;
  target: number;
  nicotineMg: number;
  actual: number | null;
  status: 'completed' | 'exceeded' | 'future';
}

interface PlanViewProps {
  onNavigateToProfile?: () => void;
}

/**
 * PlanView - "Mi Plan" page showing user's progress and reduction plan
 *
 * Features:
 * - Time remaining card with countdown
 * - Money saved and streak days
 * - Day-by-day plan progress
 * - Progress chart (plan vs actual)
 * - Plan summary link
 * - Motivational mascot card
 * - SCROLLABLE page (unlike HomeView which is fixed)
 */
export default function PlanView({ onNavigateToProfile }: PlanViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [moneySaved, setMoneySaved] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [dailyPlanData, setDailyPlanData] = useState<DayPlanData[]>([]);
  const [chartData, setChartData] = useState<Array<{
    day: number;
    planned: number;
    actual: number | null;
  }>>([]);

  const surveyAnswers = getSurveyAnswers();
  const unit = getMeasurementUnit(surveyAnswers);

  useEffect(() => {
    loadPlanData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlanData = async () => {
    try {
      setIsLoading(true);

      // Get settings for start date
      const settings = await getSettings();
      const startDate = settings.startDate;

      // Calculate current day
      const current = getCurrentPlanDay(startDate);
      setCurrentDay(current);

      // Get all daily logs
      const logs = await getAllDailyLogs();

      // Calculate money saved (as integer)
      const saved = calculateTotalMoneySaved(logs, surveyAnswers);
      setMoneySaved(saved);

      // Calculate streak days
      const streak = calculateStreakDays(logs);
      setStreakDays(streak);

      // Get daily plan targets
      const targets = getDailyPlanTargets(surveyAnswers);

      // Create a map of dates to actual counts
      const logMap = new Map<string, number>();
      logs.forEach(log => {
        logMap.set(log.date, log.count);
      });

      // Combine targets with actual data
      const start = new Date(startDate);
      const planData: DayPlanData[] = targets.map((target, index) => {
        const dayDate = new Date(start);
        dayDate.setDate(start.getDate() + index);
        const dateString = dayDate.toISOString().split('T')[0];

        const actual = logMap.get(dateString) ?? null;

        let status: 'completed' | 'exceeded' | 'future' = 'future';
        if (actual !== null) {
          status = actual <= target.target ? 'completed' : 'exceeded';
        }

        return {
          day: target.day,
          target: target.target,
          nicotineMg: target.nicotineMg,
          actual,
          status,
        };
      });

      setDailyPlanData(planData);

      // Get chart data
      const chart = getProgressChartData(logs, startDate, surveyAnswers);
      setChartData(chart);

    } catch (error) {
      console.error('Error loading plan data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-smokelog-blue-soft to-smokelog-blue-pale">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-smokelog-yellow-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando tu plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden fixed inset-0 flex flex-col bg-white">
      {/* Branded Background Image - matching HomeView and StatisticsView */}
      <div
        className="absolute inset-0 -top-20 opacity-80"
        style={{
          backgroundImage: 'url(/nuevo-fondo.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content Container - Scrollable */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-6 pb-24 pt-safe">

        {/* Header - matching HomeView and StatisticsView */}
        <header className="flex items-center justify-between pt-6 pb-6 relative z-30">
          <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
            Mi Plan
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

        {/* Card 1: Time Remaining */}
        <TimeRemainingCard currentDay={currentDay} />

        {/* Card 2: Money Saved & Streak */}
        <SavingsStreakCard moneySaved={moneySaved} streakDays={streakDays} />

        {/* Card 3: Daily Plan */}
        <DailyPlanCard
          dailyPlanData={dailyPlanData}
          currentDay={currentDay}
          unit={unit}
        />

        {/* Card 4: Progress Chart */}
        <ProgressChartCard chartData={chartData} />

        {/* Card 5: Plan Summary Link */}
        <PlanSummaryCard />

      </div>
    </div>
  );
}

/**
 * Card 1: Time Remaining Until Plan Ends
 * NOTE: This component does NOT have a card wrapper - it stands alone
 */
function TimeRemainingCard({ currentDay }: { currentDay: number }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const progressPercentage = ((currentDay - 1) / 90) * 100;

  useEffect(() => {
    // Calculate end date (90 days from start)
    const calculateTimeLeft = async () => {
      const settings = await getSettings();
      const startDate = new Date(settings.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 90);

      const updateTimer = () => {
        const now = new Date();
        const difference = endDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    };

    calculateTimeLeft();
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">Tiempo restante</h2>

      {/* Countdown Timer with 4 boxes */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {/* Days */}
        <div className="bg-gradient-to-br from-smokelog-blue-soft to-smokelog-blue-pale rounded-xl shadow-md p-4 flex flex-col items-center justify-center border border-smokelog-blue-light">
          <div className="text-3xl font-bold text-gray-900">
            {timeLeft.days}
          </div>
          <p className="text-xs text-gray-700 mt-1 font-medium">días</p>
        </div>

        {/* Hours */}
        <div className="bg-gradient-to-br from-smokelog-yellow-cream to-smokelog-yellow-golden rounded-xl shadow-md p-4 flex flex-col items-center justify-center border border-smokelog-yellow-golden">
          <div className="text-3xl font-bold text-gray-900">
            {timeLeft.hours}
          </div>
          <p className="text-xs text-gray-700 mt-1 font-medium">horas</p>
        </div>

        {/* Minutes */}
        <div className="bg-gradient-to-br from-smokelog-blue-soft to-smokelog-blue-pale rounded-xl shadow-md p-4 flex flex-col items-center justify-center border border-smokelog-blue-light">
          <div className="text-3xl font-bold text-gray-900">
            {timeLeft.minutes}
          </div>
          <p className="text-xs text-gray-700 mt-1 font-medium">minutos</p>
        </div>

        {/* Seconds */}
        <div className="bg-gradient-to-br from-smokelog-yellow-cream to-smokelog-yellow-golden rounded-xl shadow-md p-4 flex flex-col items-center justify-center border border-smokelog-yellow-golden">
          <div className="text-3xl font-bold text-gray-900">
            {timeLeft.seconds}
          </div>
          <p className="text-xs text-gray-700 mt-1 font-medium">seg</p>
        </div>
      </div>

      {/* Progress bar with brand colors */}
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-smokelog-yellow-golden to-smokelog-yellow-bright rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <p className="text-center text-sm text-gray-700 font-medium mt-3">
        Día {currentDay} de 90
      </p>
    </div>
  );
}

/**
 * Card 2: Money Saved & Streak Days
 * Design matches reference image: two rows with emoji icon, label, and value
 */
function SavingsStreakCard({ moneySaved, streakDays }: { moneySaved: number; streakDays: number }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-6">

      {/* Money Saved Row */}
      <div className="flex items-center justify-between py-3">
        {/* Icon + Label */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-smokelog-yellow-cream to-smokelog-yellow-golden flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
            💰
          </div>
          <span className="text-base font-semibold text-gray-900">Dinero ahorrado</span>
        </div>

        {/* Value */}
        <span className="text-2xl font-bold text-gray-900">€{moneySaved}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Streak Days Row */}
      <div className="flex items-center justify-between py-3">
        {/* Icon + Label */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-smokelog-blue-soft to-smokelog-blue-pale flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
            🎯
          </div>
          <span className="text-base font-semibold text-gray-900">Días dentro del límite</span>
        </div>

        {/* Value */}
        <span className="text-2xl font-bold text-gray-900">{streakDays} días</span>
      </div>

    </div>
  );
}

/**
 * Card 3: Day-by-Day Plan Progress
 * Shows all 90 days in a horizontally scrollable view with daily progress circles + today's stats
 */
function DailyPlanCard({
  dailyPlanData,
  currentDay,
  unit
}: {
  dailyPlanData: DayPlanData[];
  currentDay: number;
  unit: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get today's data
  const todayData = dailyPlanData[currentDay - 1];
  const todayActual = todayData?.actual ?? 0;
  const todayTarget = todayData?.target ?? 0;
  const todayNicotine = todayData?.nicotineMg ?? 0;

  // Auto-scroll to current day on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentDayElement = scrollContainerRef.current.querySelector(`[data-day="${currentDay}"]`);
      if (currentDayElement) {
        currentDayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentDay]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Mi plan diario</h2>

      {/* All 90 days - Horizontally scrollable */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-visible -mx-6 px-6 mb-6 py-2"
      >
        <div className="flex gap-3">
          {dailyPlanData.map((day) => {
            const isCurrentDay = day.day === currentDay;

            // Calculate progress for this day
            let progress = 0;
            if (day.actual !== null && day.target > 0) {
              progress = Math.min((day.actual / day.target) * 100, 100);
            }

            // Determine circle styling based on status - using brand colors
            let circleColor = '#e5e7eb'; // gray-200 for future days
            let textColor = 'text-gray-500';

            if (day.status === 'completed') {
              circleColor = '#c1dbec'; // smokelog-blue-light for completed
              textColor = 'text-gray-900';
            } else if (day.status === 'exceeded') {
              circleColor = '#f9d16f'; // smokelog-yellow-golden for exceeded
              textColor = 'text-gray-900';
            } else if (isCurrentDay) {
              circleColor = '#f9df64'; // smokelog-yellow-bright for current
              textColor = 'text-gray-900';
            }

            return (
              <div
                key={day.day}
                data-day={day.day}
                className="flex flex-col items-center flex-shrink-0"
              >
                {/* Circle with progress ring */}
                <div className="relative w-14 h-14 mb-1">
                  {/* Background circle */}
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    {/* Progress arc (only show for current/completed days) */}
                    {(day.actual !== null || isCurrentDay) && (
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke={circleColor}
                        strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  {/* Day number centered */}
                  <div className={`absolute inset-0 flex items-center justify-center ${textColor} font-semibold text-sm`}>
                    {day.day}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's stats - Two columns */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        {/* Left: Consumption today */}
        <div className="bg-gradient-to-br from-smokelog-blue-soft to-smokelog-blue-pale rounded-lg p-3 border border-smokelog-blue-light">
          <div className="text-2xl font-bold text-gray-900">
            {todayActual}/{todayTarget}
          </div>
          <div className="text-xs text-gray-700 mt-1 font-medium">
            {unit} hoy
          </div>
        </div>

        {/* Right: Nicotine */}
        <div className="bg-gradient-to-br from-smokelog-yellow-cream to-smokelog-yellow-golden rounded-lg p-3 border border-smokelog-yellow-golden">
          <div className="text-2xl font-bold text-gray-900">
            {todayNicotine} mg
          </div>
          <div className="text-xs text-gray-700 mt-1 font-medium">
            nicotina
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Card 4: Progress Chart (My Progress vs My Plan)
 */
function ProgressChartCard({
  chartData
}: {
  chartData: Array<{ day: number; planned: number; actual: number | null }>;
}) {
  // Simple SVG line chart
  // Show last 20 days or all data if less
  const visibleData = chartData.slice(0, 20);

  if (visibleData.length === 0) {
    return null;
  }

  // Check if there's any actual data
  const hasActualData = visibleData.some(d => d.actual !== null);

  // Find max target value and set Y-axis max to maxTarget + 10
  const maxTarget = Math.max(...visibleData.map(d => d.planned));
  const maxValue = maxTarget + 10;

  // Chart dimensions
  const width = 300;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) => (index / (visibleData.length - 1)) * chartWidth + padding.left;
  const yScale = (value: number) => height - padding.bottom - (value / maxValue) * chartHeight;

  // Create path for planned line
  const plannedPath = visibleData
    .map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.planned);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Create path for actual line (only where data exists)
  const actualPoints = visibleData
    .map((d, i) => ({ ...d, index: i }))
    .filter(d => d.actual !== null);

  const actualPath = actualPoints
    .map((d, i) => {
      const x = xScale(d.index);
      const y = yScale(d.actual!);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Mi progreso y mi plan</h2>
      <p className="text-sm text-gray-700 mb-4">
        La línea amarilla es tu plan de reducción, la azul muestra tu progreso real.
      </p>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-smokelog-yellow-golden rounded-full"></div>
          <span className="text-gray-700 font-medium">Plan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-smokelog-blue-light rounded-full"></div>
          <span className="text-gray-700 font-medium">Real</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <span className="text-gray-700 font-medium">Hoy</span>
        </div>
      </div>

      {/* Chart or Empty State */}
      {hasActualData ? (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            style={{ minWidth: '300px' }}
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
              const y = height - padding.bottom - percent * chartHeight;
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 5}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {Math.round(maxValue * percent)}
                  </text>
                </g>
              );
            })}

            {/* Planned line (yellow/golden) */}
            <path
              d={plannedPath}
              fill="none"
              stroke="#f9d16f"
              strokeWidth="3"
            />

            {/* Actual line (blue) */}
            {actualPath && (
              <path
                d={actualPath}
                fill="none"
                stroke="#c1dbec"
                strokeWidth="3"
              />
            )}

            {/* Today marker */}
            {actualPoints.length > 0 && (
              <circle
                cx={xScale(actualPoints[actualPoints.length - 1].index)}
                cy={yScale(actualPoints[actualPoints.length - 1].actual!)}
                r="5"
                fill="#1f2937"
              />
            )}
          </svg>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center px-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-gray-600 font-medium">No hay datos todavía</p>
            <p className="text-sm text-gray-500 mt-1">Tu gráfico de progreso aparecerá aquí</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Card 5: Plan Summary Link
 */
function PlanSummaryCard() {
  const handleClick = () => {
    // TODO: Navigate to plan summary page
    alert('Navegación al resumen del plan - En desarrollo');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 flex items-center justify-between hover:bg-white active:scale-[0.98] transition-all duration-200 min-h-[88px]"
      aria-label="Ver resumen de tu plan completo"
    >
      <div className="text-left">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Resumen de tu plan</h2>
        <p className="text-sm text-gray-700">Ver detalles completos del plan</p>
      </div>

      {/* Arrow icon - Increased size for better touch target */}
      <div className="w-11 h-11 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

