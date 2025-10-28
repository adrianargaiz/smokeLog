import { ChevronLeft, ChevronRight, FileText, Mail, Share2, Star, Shield, ShoppingBag, RotateCcw, Info, Cloud } from 'lucide-react';

interface ProfileViewProps {
  onBack: () => void;
}

/**
 * ProfileView - User profile and settings menu
 *
 * Features:
 * - Premium promotion banner
 * - Menu items for app information and actions
 * - How It Works, Contact, Share, Rate
 * - Legal documents (Terms, Privacy)
 * - Reset options
 * - Clean, accessible design in Spanish
 */
export default function ProfileView({ onBack }: ProfileViewProps) {
  const handleMenuItemClick = (action: string) => {
    console.log('Menu item clicked:', action);

    switch (action) {
      case 'how-it-works':
        alert('Esta función estará disponible próximamente');
        break;
      case 'nicotine-strength':
        alert('Esta función estará disponible próximamente');
        break;
      case 'contact':
        window.location.href = 'mailto:support@smokelog.app';
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'SmokeLog',
            text: '¡Descubre SmokeLog! La mejor app para dejar de fumar',
            url: window.location.origin,
          }).catch(err => console.log('Error sharing:', err));
        } else {
          alert('Tu dispositivo no soporta compartir. URL: ' + window.location.origin);
        }
        break;
      case 'rate':
        alert('Gracias por tu interés. La función de calificación estará disponible cuando la app esté en las tiendas.');
        break;
      case 'terms':
        alert('Términos de Uso: Esta función estará disponible próximamente');
        break;
      case 'privacy':
        alert('Política de Privacidad: Esta función estará disponible próximamente');
        break;
      case 'restore':
        alert('Restaurar Compras: Esta función estará disponible próximamente');
        break;
      case 'reset':
        if (window.confirm('¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.')) {
          alert('Función de reset: Esta acción estará disponible próximamente');
        }
        break;
      default:
        break;
    }
  };

  const handlePremiumClick = () => {
    alert('¡Próximamente! Las funciones premium estarán disponibles pronto.');
  };

  const menuItems = [
    {
      id: 'how-it-works',
      icon: Info,
      label: 'Cómo Funciona',
      color: 'text-gray-700',
    },
    {
      id: 'nicotine-strength',
      icon: Cloud,
      label: 'Nivel de Nicotina',
      color: 'text-gray-700',
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'Contáctanos',
      color: 'text-gray-700',
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Compartir App',
      color: 'text-gray-700',
    },
    {
      id: 'rate',
      icon: Star,
      label: 'Califícanos',
      color: 'text-gray-700',
    },
    {
      id: 'terms',
      icon: FileText,
      label: 'Términos de Uso',
      color: 'text-gray-700',
    },
    {
      id: 'privacy',
      icon: Shield,
      label: 'Política de Privacidad',
      color: 'text-gray-700',
    },
    {
      id: 'restore',
      icon: ShoppingBag,
      label: 'Restaurar Compras',
      color: 'text-gray-700',
    },
  ];

  return (
    <div className="min-h-screen bg-smokelog-blue-pale flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <div className="w-11" /> {/* Spacer for center alignment */}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        {/* Premium Banner */}
        <div className="mb-6">
          <div
            className="relative overflow-hidden rounded-2xl p-6 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7dd3fc 0%, #93c5fd 100%)',
            }}
          >
            {/* Cloud Character */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Cloud face */}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                  <div className="text-4xl">☁️</div>
                </div>
                {/* Waving hand */}
                <div className="absolute -right-2 top-6 text-2xl animate-bounce">
                  👋
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="relative z-10 pr-24">
              <h2 className="text-xl font-bold text-white mb-3 drop-shadow-sm">
                Start My Quit Plan
              </h2>
              <button
                onClick={handlePremiumClick}
                className="bg-white/90 hover:bg-white text-blue-600 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                Go Premium
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-gray-900 font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}

          {/* Reset All Puffs - Special styling */}
          <button
            onClick={() => handleMenuItemClick('reset')}
            className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 border border-red-200"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-red-500" />
              <span className="text-red-500 font-medium">Resetear Todos los Datos</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* Footer spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
