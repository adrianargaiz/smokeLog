import { useState } from 'react';

interface WelcomeViewProps {
  onComplete: () => void;
}

/**
 * WelcomeView - Onboarding screen for SmokeLOG app
 *
 * Features:
 * - Animated sun mascot with floating effect
 * - Sky background with clouds
 * - Welcoming message in Spanish
 * - Smooth transitions and entrance animations
 * - Responsive design for all mobile screen sizes
 * - Call-to-action button matching reference design
 */
export default function WelcomeView({ onComplete }: WelcomeViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sky Background with Clouds */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-smokelog-blue-soft via-smokelog-blue-pale to-white"
        style={{
          backgroundImage: 'url(/sky-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content Container */}
      <div className={`relative z-10 flex flex-col items-center justify-between min-h-screen px-6 py-12 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>

        {/* Top Section - Welcome Title */}
        <div className="flex-none pt-8 pb-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            ¡Bienvenido!
          </h1>
        </div>

        {/* Middle Section - Mascot */}
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-fade-in">
            {/* Sun Mascot with floating animation - NOW LARGER! */}
            <div className="animate-float">
              <img
                src="/sun-mascot.png"
                alt="SmokeLOG Mascot"
                className="w-96 h-auto object-contain drop-shadow-lg"
                style={{ maxHeight: '24rem' }}
              />
            </div>
          </div>
        </div>

        {/* Text Content - Slogan and Description */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-slide-up">
          {/* Slogan */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Tu compañero en el camino
          </h2>

          {/* Description */}
          <p className="text-base text-gray-600 leading-relaxed max-w-sm px-4">
            Estamos aquí para ayudarte a dejarlo. Rastrea tu progreso, celebra tus logros y toma el control de tu salud.
          </p>
        </div>

        {/* Bottom Section - CTA Button */}
        <div className="w-full max-w-sm pb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleStart}
            className="w-full bg-smokelog-blue-light hover:bg-opacity-90 active:scale-[0.98] text-gray-900 font-semibold text-lg py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 ease-out"
            style={{
              backgroundColor: '#c1dbec',
            }}
          >
            Empecemos
          </button>

          {/* Optional: Skip text for returning users */}
          <p className="text-center text-sm text-gray-500 mt-4 opacity-70">
            Comienza tu viaje hacia una vida más saludable
          </p>
        </div>
      </div>
    </div>
  );
}
