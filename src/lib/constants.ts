/**
 * Constantes de la aplicación SmokeLog
 */

// Valores por defecto
export const DEFAULT_DAILY_GOAL = 20;
export const DEFAULT_NOTIFICATIONS_ENABLED = false;

// Umbrales de progreso (porcentajes)
export const PROGRESS_THRESHOLD_WARNING = 0.8; // 80% del objetivo = amarillo
export const PROGRESS_THRESHOLD_EXCEEDED = 1.0; // 100% del objetivo = rojo

// Formato de fechas
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'd MMM yyyy';
export const DISPLAY_TIME_FORMAT = 'HH:mm';

// Claves de almacenamiento
export const DB_NAME = 'smokelog_db';
export const DB_VERSION = 1;

// Períodos de tiempo
export const DAYS_IN_WEEK = 7;
export const DAYS_IN_MONTH = 30;

// Colores para estados de progreso
export const COLORS = {
  primary: '#3b82f6',
  accent: '#f97316',
  success: '#10b981',
  warning: '#f59e0b',
  destructive: '#ef4444',
  muted: '#6b7280',
} as const;

// Mensajes de la app
export const MESSAGES = {
  emptyHistory: 'No hay datos registrados todavía',
  goalAchieved: '¡Objetivo cumplido!',
  goalExceeded: 'Has superado tu objetivo',
  goalWarning: 'Te estás acercando a tu límite',
  deleteConfirm: '¿Estás seguro de que quieres eliminar todos los datos?',
  exportSuccess: 'Datos exportados exitosamente',
} as const;

// Configuración de exportación
export const CSV_HEADERS = ['Fecha', 'Cantidad', 'Objetivo', 'Notas'];
export const CSV_FILENAME_PREFIX = 'smokelog_export';
