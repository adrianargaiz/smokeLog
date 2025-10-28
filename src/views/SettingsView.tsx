import { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import GoalSetting from '@/components/GoalSetting';
import { Download, Trash2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SettingsView() {
  const { settings, dailyLogs, clearAllData, downloadCSV, downloadJSON } = useDatabase();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetWelcome = () => {
    if (window.confirm('¿Quieres volver a ver la pantalla de bienvenida?')) {
      localStorage.removeItem('smokelog_welcome_seen');
      window.location.reload();
    }
  };

  const handleResetOnboarding = () => {
    if (window.confirm('¿Quieres resetear la bienvenida Y la encuesta para empezar de nuevo?')) {
      localStorage.removeItem('smokelog_welcome_seen');
      localStorage.removeItem('smokelog_survey_completed');
      localStorage.removeItem('smokelog_survey_answers');
      window.location.reload();
    }
  };

  const handleClearData = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      '¡Última advertencia! Se eliminarán todos tus registros y configuraciones. ¿Continuar?'
    );

    if (!doubleConfirm) return;

    try {
      setIsDeleting(true);
      await clearAllData();
      alert('Todos los datos han sido eliminados');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Error al eliminar los datos');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await downloadCSV();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar CSV');
    }
  };

  const handleExportJSON = async () => {
    try {
      await downloadJSON();
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Error al exportar JSON');
    }
  };

  return (
    <div className="min-h-screen bg-smokelog-blue-pale flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-6 px-4 shadow-md flex-shrink-0">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Ajustes</h1>
          <p className="text-blue-100 text-sm mt-1">
            Configura tu experiencia
          </p>
        </div>
      </header>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Goal Setting */}
        <GoalSetting />

        {/* Export Data */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Exportar Datos
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Descarga tus datos en formato CSV o JSON
          </p>
          <div className="space-y-3">
            <button
              onClick={handleExportCSV}
              disabled={dailyLogs.length === 0}
              className="
                w-full py-3 px-4
                bg-green-600 hover:bg-green-700
                text-white font-semibold rounded-lg
                shadow hover:shadow-md
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              <Download className="w-5 h-5" />
              Descargar CSV
            </button>
            <button
              onClick={handleExportJSON}
              disabled={dailyLogs.length === 0}
              className="
                w-full py-3 px-4
                bg-blue-600 hover:bg-blue-700
                text-white font-semibold rounded-lg
                shadow hover:shadow-md
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              <Download className="w-5 h-5" />
              Descargar JSON
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-700 mb-4">
            Zona de Peligro
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Esta acción eliminará todos tus datos permanentemente
          </p>
          <button
            onClick={handleClearData}
            disabled={isDeleting}
            className="
              w-full py-3 px-4
              bg-red-600 hover:bg-red-700
              text-white font-semibold rounded-lg
              shadow hover:shadow-md
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            <Trash2 className="w-5 h-5" />
            {isDeleting ? 'Eliminando...' : 'Eliminar Todos los Datos'}
          </button>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Información
            </h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Versión:</span>
              <span className="font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Registros totales:</span>
              <span className="font-semibold">{dailyLogs.length}</span>
            </div>
            {settings && (
              <div className="flex justify-between">
                <span>Inicio del seguimiento:</span>
                <span className="font-semibold capitalize">
                  {format(new Date(settings.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <button
              onClick={handleResetWelcome}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              Ver pantalla de bienvenida
            </button>
            <button
              onClick={handleResetOnboarding}
              className="w-full py-2 px-4 bg-blue-200 hover:bg-blue-300 text-blue-800 font-medium rounded-lg transition-colors duration-200"
            >
              Resetear Bienvenida + Encuesta
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>SmokeLog - Tu compañero para dejar de fumar</p>
          <p className="mt-1">Hecho con ❤️ para tu salud</p>
        </div>
        </div>
      </div>
    </div>
  );
}
