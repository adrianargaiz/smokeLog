/**
 * Registro diario de cigarrillos fumados
 */
export interface DailyLog {
  id?: number;
  date: string; // YYYY-MM-DD
  count: number;
  goal: number;
  notes?: string;
  timestamp: number; // Unix timestamp for sorting
}

/**
 * Configuración de la aplicación
 */
export interface Settings {
  id?: number;
  dailyGoal: number;
  startDate: string; // YYYY-MM-DD - fecha de inicio del seguimiento
  notificationsEnabled: boolean;
}

/**
 * Estadísticas calculadas
 */
export interface Statistics {
  weeklyAverage: number;
  monthlyAverage: number;
  totalThisWeek: number;
  totalThisMonth: number;
  bestDay: {
    date: string;
    count: number;
  } | null;
  worstDay: {
    date: string;
    count: number;
  } | null;
  comparisonWithYesterday: number; // Diferencia: negativo = mejora, positivo = empeoró
  comparisonWithLastWeek: number;
  streak: number; // Días consecutivos cumpliendo objetivo
}

/**
 * Vista para navegación
 */
export type ViewType = 'home' | 'history' | 'statistics' | 'settings' | 'profile';

/**
 * Período de tiempo para gráficos
 */
export type TimePeriod = '7days' | '30days' | 'all';

/**
 * Estado de progreso del día
 */
export type ProgressStatus = 'good' | 'warning' | 'exceeded';

/**
 * Survey-related types for onboarding
 */
export type SmokeType = 'fumar' | 'vapear';
export type GoalType = 'complete' | 'reduce';

export interface SurveyAnswers {
  q1_type: SmokeType | null;
  q2_goal: GoalType | null;
  q3_duration: string | null;
  q4_frequency: string | null;
  q5_dailyAmount: number | null;
  q6_difficulty: string | null;
  q7_affectedArea: string | null;
  q8_monthlySpending: number | null;
}
