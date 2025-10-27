import type { ViewType } from '@/types';

interface BottomNavProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
}

/**
 * BottomNav - Fixed bottom navigation bar
 *
 * Features:
 * - Three tabs: Home, History (Plan), Settings (Statistics)
 * - Icons with labels
 * - Active state highlighting with yellow accent
 * - Smooth transitions
 * - Fixed at bottom of screen
 * - Touch-friendly button sizes
 */
export default function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const tabs = [
    {
      id: 'home' as ViewType,
      label: 'Inicio',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-smokelog-yellow-golden' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: 'history' as ViewType,
      label: 'Mi Plan',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-smokelog-yellow-golden' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'statistics' as ViewType,
      label: 'Estadísticas',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-smokelog-yellow-golden' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'settings' as ViewType,
      label: 'Ajustes',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? 'text-smokelog-yellow-golden' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[9999] pb-safe-bottom"
    >
      <div className="max-w-lg mx-auto flex justify-around items-stretch">
        {tabs.map(tab => {
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-4 px-4 transition-all duration-200 ${
                isActive
                  ? 'bg-smokelog-yellow-cream/30'
                  : 'hover:bg-gray-50 active:bg-gray-100'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon */}
              <div className="mb-1">
                {tab.icon(isActive)}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-smokelog-yellow-golden' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>

              {/* Active indicator line */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-smokelog-yellow-golden rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
