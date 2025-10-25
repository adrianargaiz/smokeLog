/**
 * Survey Helper Functions
 *
 * Utility functions to work with survey data throughout the app
 */

import type { SurveyAnswers } from '../types';

/**
 * Get survey answers from localStorage
 */
export function getSurveyAnswers(): SurveyAnswers | null {
  try {
    const data = localStorage.getItem('smokelog_survey_answers');
    if (data) {
      return JSON.parse(data) as SurveyAnswers;
    }
    return null;
  } catch (error) {
    console.error('Error parsing survey answers:', error);
    return null;
  }
}

/**
 * Check if survey has been completed
 */
export function isSurveyCompleted(): boolean {
  return localStorage.getItem('smokelog_survey_completed') === 'true';
}

/**
 * Get the measurement unit based on smoke type
 * Returns "cigarros" for smoking, "caladas" for vaping
 */
export function getMeasurementUnit(answers?: SurveyAnswers | null): string {
  const surveyData = answers || getSurveyAnswers();
  if (!surveyData || !surveyData.q1_type) {
    return 'caladas'; // Default to vaping
  }
  return surveyData.q1_type === 'fumar' ? 'cigarros' : 'caladas';
}

/**
 * Get the measurement unit in singular form
 */
export function getMeasurementUnitSingular(answers?: SurveyAnswers | null): string {
  const surveyData = answers || getSurveyAnswers();
  if (!surveyData || !surveyData.q1_type) {
    return 'calada';
  }
  return surveyData.q1_type === 'fumar' ? 'cigarro' : 'calada';
}

/**
 * Get the activity verb (fumar/vapear)
 */
export function getActivityVerb(answers?: SurveyAnswers | null): string {
  const surveyData = answers || getSurveyAnswers();
  if (!surveyData || !surveyData.q1_type) {
    return 'vapear';
  }
  return surveyData.q1_type === 'fumar' ? 'fumar' : 'vapear';
}

/**
 * Get the activity noun (tabaquismo/vapeo)
 */
export function getActivityNoun(answers?: SurveyAnswers | null): string {
  const surveyData = answers || getSurveyAnswers();
  if (!surveyData || !surveyData.q1_type) {
    return 'vapeo';
  }
  return surveyData.q1_type === 'fumar' ? 'tabaquismo' : 'vapeo';
}

/**
 * Check if user wants to quit completely (vs reduce)
 */
export function wantsToQuitCompletely(answers?: SurveyAnswers | null): boolean {
  const surveyData = answers || getSurveyAnswers();
  return surveyData?.q2_goal === 'complete';
}

/**
 * Get the daily baseline amount from survey
 *
 * IMPORTANT: Q5 answer is stored in CALADAS (raw user input)
 * - For "fumar" users: Convert caladas to cigarros (1 cigarro = 10 caladas)
 * - For "vapear" users: Return raw caladas value
 *
 * @returns Baseline in the appropriate unit (cigarros or caladas)
 */
export function getDailyBaseline(answers?: SurveyAnswers | null): number {
  const surveyData = answers || getSurveyAnswers();
  const rawAmount = surveyData?.q5_dailyAmount || 100; // Default to 100 caladas
  const smokeType = surveyData?.q1_type;

  // If user smokes cigarettes, convert caladas to cigarros
  // 1 cigarro = 10 caladas
  if (smokeType === 'fumar') {
    return Math.round(rawAmount / 10);
  }

  // If user vapes, Q5 answer is already in caladas
  return rawAmount;
}

/**
 * Get monthly spending from survey
 */
export function getMonthlySpending(answers?: SurveyAnswers | null): number {
  const surveyData = answers || getSurveyAnswers();
  return surveyData?.q8_monthlySpending || 0;
}

/**
 * Calculate reduction target based on goal type
 *
 * For "complete" goal: aggressive reduction to 0
 * For "reduce" goal: gradual reduction to 30% of baseline
 *
 * @param currentDay - Day number in the program (0-based)
 * @param totalDays - Total days in reduction program (default: 90)
 * @returns Target amount for the given day
 */
export function calculateDailyTarget(
  currentDay: number,
  totalDays: number = 90,
  answers?: SurveyAnswers | null
): number {
  const surveyData = answers || getSurveyAnswers();
  const baseline = getDailyBaseline(surveyData);
  const isComplete = wantsToQuitCompletely(surveyData);

  if (currentDay >= totalDays) {
    return isComplete ? 0 : Math.round(baseline * 0.3); // 30% of baseline for reduction
  }

  const progress = currentDay / totalDays; // 0 to 1

  if (isComplete) {
    // Linear reduction to 0
    return Math.round(baseline * (1 - progress));
  } else {
    // Gradual reduction to 30% of baseline
    return Math.round(baseline * (1 - (progress * 0.7)));
  }
}

/**
 * Calculate money saved based on current vs baseline consumption
 *
 * @param currentAmount - Current daily consumption
 * @param days - Number of days
 * @returns Money saved in euros
 */
export function calculateMoneySaved(
  currentAmount: number,
  days: number,
  answers?: SurveyAnswers | null
): number {
  const surveyData = answers || getSurveyAnswers();
  const baseline = getDailyBaseline(surveyData);
  const monthlySpending = getMonthlySpending(surveyData);

  if (monthlySpending === 0 || baseline === 0) {
    return 0;
  }

  // Calculate cost per unit (cigarro/calada)
  const costPerUnit = monthlySpending / (baseline * 30); // Assuming 30 days in month

  // Calculate units saved
  const unitsSaved = (baseline - currentAmount) * days;

  // Calculate money saved
  return Math.round(unitsSaved * costPerUnit * 100) / 100; // Round to 2 decimals
}

/**
 * Get user's main difficulty (for personalized tips)
 */
export function getMainDifficulty(answers?: SurveyAnswers | null): string | null {
  const surveyData = answers || getSurveyAnswers();
  return surveyData?.q6_difficulty || null;
}

/**
 * Get user's most affected life area
 */
export function getAffectedArea(answers?: SurveyAnswers | null): string | null {
  const surveyData = answers || getSurveyAnswers();
  return surveyData?.q7_affectedArea || null;
}

/**
 * Generate personalized motivation message based on survey answers
 */
export function getMotivationMessage(answers?: SurveyAnswers | null): string {
  const surveyData = answers || getSurveyAnswers();

  if (!surveyData) {
    return '¡Sigue adelante! Cada día es un paso hacia una vida más saludable.';
  }

  const area = getAffectedArea(surveyData);
  const isComplete = wantsToQuitCompletely(surveyData);

  const messages: { [key: string]: string } = {
    health: 'Tu salud mejora con cada día que pasa. ¡Sigue así!',
    mental_health: 'Cuida tu bienestar mental. Cada progreso cuenta.',
    finances: 'Estás ahorrando dinero cada día. ¡Tu bolsillo te lo agradece!',
    relationships: 'Tus relaciones mejorarán con este cambio positivo.',
    energy: 'Pronto sentirás más energía y mejor concentración.',
  };

  if (area && messages[area]) {
    return messages[area];
  }

  return isComplete
    ? '¡Vas camino a dejarlo por completo! No te rindas.'
    : '¡Cada reducción es un logro! Estás progresando.';
}

/**
 * Reset survey data (for testing or re-onboarding)
 */
export function resetSurvey(): void {
  localStorage.removeItem('smokelog_survey_completed');
  localStorage.removeItem('smokelog_survey_answers');
}

/**
 * Calculate current day number in the plan (1-90)
 * @param startDate - Plan start date (YYYY-MM-DD string)
 * @returns Current day number (1-90)
 */
export function getCurrentPlanDay(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();

  // Reset time to midnight for accurate day calculation
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Return day number (1-based), capped at 90
  return Math.min(Math.max(diffDays + 1, 1), 90);
}

/**
 * Calculate days remaining in the 90-day plan
 * @param startDate - Plan start date (YYYY-MM-DD string)
 * @returns Days remaining (0-90)
 */
export function getDaysRemaining(startDate: string): number {
  const currentDay = getCurrentPlanDay(startDate);
  return Math.max(90 - currentDay + 1, 0);
}

/**
 * Calculate total money saved so far based on actual consumption vs baseline
 * Uses daily logs to calculate real savings
 * @param dailyLogs - Array of daily logs with actual consumption
 * @param answers - Survey answers
 * @returns Total money saved (integer, no decimals)
 */
export function calculateTotalMoneySaved(
  dailyLogs: Array<{ count: number }>,
  answers?: SurveyAnswers | null
): number {
  const surveyData = answers || getSurveyAnswers();
  const baseline = getDailyBaseline(surveyData);
  const monthlySpending = getMonthlySpending(surveyData);

  if (monthlySpending === 0 || baseline === 0 || dailyLogs.length === 0) {
    return 0;
  }

  // Calculate cost per unit (cigarro/calada)
  const costPerUnit = monthlySpending / (baseline * 30); // Assuming 30 days per month

  // Calculate total units saved across all logged days
  let totalUnitsSaved = 0;
  dailyLogs.forEach(log => {
    const saved = baseline - log.count;
    if (saved > 0) {
      totalUnitsSaved += saved;
    }
  });

  // Calculate money saved and round to integer
  const moneySaved = totalUnitsSaved * costPerUnit;
  return Math.floor(moneySaved); // Return as integer, no decimals
}

/**
 * Calculate streak days - consecutive days within or below target
 * @param dailyLogs - Array of daily logs (should be sorted by date descending)
 * @param answers - Survey answers
 * @returns Number of consecutive days within target
 */
export function calculateStreakDays(
  dailyLogs: Array<{ date: string; count: number; goal: number }>
): number {
  if (dailyLogs.length === 0) {
    return 0;
  }

  // Logs should be sorted by date descending (most recent first)
  // Count consecutive days from today backwards where count <= goal
  let streak = 0;

  for (const log of dailyLogs) {
    if (log.count <= log.goal) {
      streak++;
    } else {
      break; // Streak is broken
    }
  }

  return streak;
}

/**
 * Calculate nicotine amount in mg based on consumption
 * 1 cigarette = 8mg nicotine
 * 10 puffs (caladas) = 8mg nicotine
 * @param amount - Amount consumed (cigarros or caladas)
 * @param unit - Unit type ('cigarros' or 'caladas')
 * @returns Nicotine in mg
 */
export function calculateNicotineMg(amount: number, unit: string): number {
  if (unit === 'cigarros') {
    return Math.round(amount * 8);
  } else {
    // caladas: 10 caladas = 8mg
    return Math.round((amount / 10) * 8);
  }
}

/**
 * Generate daily plan targets for all 90 days
 * @param answers - Survey answers
 * @returns Array of daily targets with day number, target amount, and nicotine
 */
export function getDailyPlanTargets(answers?: SurveyAnswers | null): Array<{
  day: number;
  target: number;
  nicotineMg: number;
}> {
  const surveyData = answers || getSurveyAnswers();
  const unit = getMeasurementUnit(surveyData);
  const targets = [];

  for (let day = 0; day < 90; day++) {
    const target = calculateDailyTarget(day, 90, surveyData);
    const nicotineMg = calculateNicotineMg(target, unit);

    targets.push({
      day: day + 1, // 1-based day number
      target,
      nicotineMg,
    });
  }

  return targets;
}

/**
 * Get progress chart data combining plan targets and actual consumption
 * @param dailyLogs - Array of daily logs
 * @param startDate - Plan start date
 * @param answers - Survey answers
 * @returns Chart data with planned and actual values
 */
export function getProgressChartData(
  dailyLogs: Array<{ date: string; count: number }>,
  startDate: string,
  answers?: SurveyAnswers | null
): Array<{
  day: number;
  planned: number;
  actual: number | null;
  date: string;
}> {
  const surveyData = answers || getSurveyAnswers();
  const chartData = [];
  const start = new Date(startDate);

  // Create a map of dates to actual counts
  const logMap = new Map<string, number>();
  dailyLogs.forEach(log => {
    logMap.set(log.date, log.count);
  });

  // Generate data for all 90 days
  for (let day = 0; day < 90; day++) {
    const planned = calculateDailyTarget(day, 90, surveyData);

    // Calculate the date for this day
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + day);
    const dateString = dayDate.toISOString().split('T')[0];

    // Get actual value if it exists
    const actual = logMap.get(dateString) ?? null;

    chartData.push({
      day: day + 1,
      planned,
      actual,
      date: dateString,
    });
  }

  return chartData;
}
