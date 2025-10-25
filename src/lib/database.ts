import Dexie, { type EntityTable } from 'dexie';
import type { DailyLog, Settings } from '@/types';
import { DEFAULT_DAILY_GOAL, DEFAULT_NOTIFICATIONS_ENABLED, DB_NAME, DB_VERSION } from './constants';
import { format } from 'date-fns';

/**
 * Base de datos IndexedDB usando Dexie.js
 */
class SmokeLogDatabase extends Dexie {
  dailyLogs!: EntityTable<DailyLog, 'id'>;
  settings!: EntityTable<Settings, 'id'>;

  constructor() {
    super(DB_NAME);

    this.version(DB_VERSION).stores({
      dailyLogs: '++id, date, timestamp',
      settings: '++id'
    });
  }
}

// Instancia única de la base de datos
export const db = new SmokeLogDatabase();

/**
 * Inicializa la base de datos con valores por defecto si es necesario
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Verificar si ya existen configuraciones
    const settingsCount = await db.settings.count();

    if (settingsCount === 0) {
      // Crear configuración por defecto
      await db.settings.add({
        dailyGoal: DEFAULT_DAILY_GOAL,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        notificationsEnabled: DEFAULT_NOTIFICATIONS_ENABLED
      });
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Obtiene la configuración actual
 */
export async function getSettings(): Promise<Settings> {
  try {
    const settings = await db.settings.toArray();

    if (settings.length === 0) {
      // No debería pasar si initializeDatabase se llamó, pero por seguridad
      const newSettings: Settings = {
        dailyGoal: DEFAULT_DAILY_GOAL,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        notificationsEnabled: DEFAULT_NOTIFICATIONS_ENABLED
      };
      await db.settings.add(newSettings);
      return newSettings;
    }

    return settings[0];
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
}

/**
 * Actualiza la configuración
 */
export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  try {
    const current = await getSettings();

    if (current.id) {
      await db.settings.update(current.id, updates);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

/**
 * Obtiene el registro de un día específico
 */
export async function getDailyLog(date: string): Promise<DailyLog | undefined> {
  try {
    return await db.dailyLogs.where('date').equals(date).first();
  } catch (error) {
    console.error('Error getting daily log:', error);
    throw error;
  }
}

/**
 * Crea o actualiza el registro diario
 */
export async function upsertDailyLog(log: Omit<DailyLog, 'id'>): Promise<number> {
  try {
    const existing = await getDailyLog(log.date);

    if (existing && existing.id !== undefined) {
      await db.dailyLogs.update(existing.id, log);
      return existing.id;
    } else {
      const id = await db.dailyLogs.add(log as DailyLog);
      return id as number;
    }
  } catch (error) {
    console.error('Error upserting daily log:', error);
    throw error;
  }
}

/**
 * Obtiene registros en un rango de fechas
 */
export async function getDailyLogsInRange(startDate: string, endDate: string): Promise<DailyLog[]> {
  try {
    return await db.dailyLogs
      .where('date')
      .between(startDate, endDate, true, true)
      .reverse()
      .sortBy('date');
  } catch (error) {
    console.error('Error getting daily logs in range:', error);
    throw error;
  }
}

/**
 * Obtiene todos los registros
 */
export async function getAllDailyLogs(): Promise<DailyLog[]> {
  try {
    return await db.dailyLogs.orderBy('date').reverse().toArray();
  } catch (error) {
    console.error('Error getting all daily logs:', error);
    throw error;
  }
}

/**
 * Obtiene los últimos N días de registros
 */
export async function getLastNDaysLogs(days: number): Promise<DailyLog[]> {
  try {
    return await db.dailyLogs
      .orderBy('date')
      .reverse()
      .limit(days)
      .toArray();
  } catch (error) {
    console.error('Error getting last N days logs:', error);
    throw error;
  }
}

/**
 * Elimina un registro específico
 */
export async function deleteDailyLog(id: number): Promise<void> {
  try {
    await db.dailyLogs.delete(id);
  } catch (error) {
    console.error('Error deleting daily log:', error);
    throw error;
  }
}

/**
 * Elimina todos los datos de la aplicación
 */
export async function clearAllData(): Promise<void> {
  try {
    await db.dailyLogs.clear();
    await db.settings.clear();
    await initializeDatabase();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

/**
 * Exporta todos los datos a formato JSON
 */
export async function exportDataAsJSON(): Promise<string> {
  try {
    const logs = await getAllDailyLogs();
    const settings = await getSettings();

    const exportData = {
      version: DB_VERSION,
      exportDate: new Date().toISOString(),
      settings,
      dailyLogs: logs
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

/**
 * Exporta datos a formato CSV
 */
export async function exportDataAsCSV(): Promise<string> {
  try {
    const logs = await getAllDailyLogs();

    const headers = ['Fecha', 'Cantidad', 'Objetivo', 'Notas'];
    const rows = logs.map(log => [
      log.date,
      log.count.toString(),
      log.goal.toString(),
      log.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
}
