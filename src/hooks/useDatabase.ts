import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Settings, DailyLog } from '@/types';
import {
  initializeDatabase,
  getSettings,
  updateSettings as dbUpdateSettings,
  getAllDailyLogs,
  clearAllData as dbClearAllData,
  exportDataAsJSON,
  exportDataAsCSV
} from '@/lib/database';

export interface UseDatabaseResult {
  settings: Settings | undefined;
  dailyLogs: DailyLog[];
  isLoading: boolean;
  error: Error | null;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  clearAllData: () => Promise<void>;
  exportJSON: () => Promise<string>;
  exportCSV: () => Promise<string>;
  downloadCSV: () => Promise<void>;
  downloadJSON: () => Promise<void>;
}

/**
 * Hook principal para gestionar la base de datos
 * Proporciona acceso reactivo a settings y logs
 */
export function useDatabase(): UseDatabaseResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Query reactiva para settings - se actualiza automáticamente cuando cambia la BD
  const settings = useLiveQuery(async () => {
    try {
      return await getSettings();
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err as Error);
      return undefined;
    }
  });

  // Query reactiva para todos los logs
  const dailyLogs = useLiveQuery(async () => {
    try {
      return await getAllDailyLogs();
    } catch (err) {
      console.error('Error fetching daily logs:', err);
      setError(err as Error);
      return [];
    }
  }, []) ?? [];

  // Inicializar la base de datos al montar
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initializeDatabase();
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Actualizar configuración
  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    try {
      setError(null);
      await dbUpdateSettings(updates);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err as Error);
      throw err;
    }
  }, []);

  // Limpiar todos los datos
  const clearAllData = useCallback(async () => {
    try {
      setError(null);
      await dbClearAllData();
    } catch (err) {
      console.error('Error clearing data:', err);
      setError(err as Error);
      throw err;
    }
  }, []);

  // Exportar como JSON
  const exportJSON = useCallback(async (): Promise<string> => {
    try {
      setError(null);
      return await exportDataAsJSON();
    } catch (err) {
      console.error('Error exporting JSON:', err);
      setError(err as Error);
      throw err;
    }
  }, []);

  // Exportar como CSV
  const exportCSV = useCallback(async (): Promise<string> => {
    try {
      setError(null);
      return await exportDataAsCSV();
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setError(err as Error);
      throw err;
    }
  }, []);

  // Descargar CSV como archivo
  const downloadCSV = useCallback(async () => {
    try {
      const csvData = await exportCSV();
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `smokelog_export_${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      setError(err as Error);
      throw err;
    }
  }, [exportCSV]);

  // Descargar JSON como archivo
  const downloadJSON = useCallback(async () => {
    try {
      const jsonData = await exportJSON();
      const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `smokelog_export_${new Date().toISOString().split('T')[0]}.json`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading JSON:', err);
      setError(err as Error);
      throw err;
    }
  }, [exportJSON]);

  return {
    settings,
    dailyLogs,
    isLoading,
    error,
    updateSettings,
    clearAllData,
    exportJSON,
    exportCSV,
    downloadCSV,
    downloadJSON
  };
}
