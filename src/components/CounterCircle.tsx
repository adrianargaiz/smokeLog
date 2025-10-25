import { useState } from 'react';

interface CounterCircleProps {
  count: number;
  target: number;
  unit: string;
  onClick: () => void;
}

/**
 * CounterCircle - Large circular counter component
 *
 * Features:
 * - Large, prominent circular design with progress ring
 * - Displays current count vs target goal
 * - Clickable to increment counter
 * - Ripple effect on click
 * - Scale animation for feedback
 * - Dynamic progress indicator
 */
export default function CounterCircle({ count, target, unit, onClick }: CounterCircleProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // SVG circle configuration
  // Container: w-80 = 320px, with p-10 (40px each side) = 240px available
  // Need: (radius + strokeWidth/2) * 2 <= 240px
  // Formula: (radius + 9) * 2 <= 240 → radius <= 111px
  // Using radius 110px: (110 + 9) * 2 = 238px < 240px ✓
  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress percentage for the ring
  // Use actual progress (can exceed 100%) for color, but cap at 100% for display
  const actualProgress = target > 0 ? (count / target) * 100 : 0;
  const displayProgress = Math.min(actualProgress, 100);

  // Calculate stroke offset (starts at top, fills clockwise)
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

  // Determine progress color based on status
  const getProgressColor = () => {
    if (count <= target) return '#3b82f6'; // Blue - on track (darker, better contrast)
    if (count <= target * 1.2) return '#f59e0b'; // Yellow - slightly over
    return '#ef4444'; // Red - significantly over
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get click position relative to button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add ripple effect
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    // Press animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Execute click handler
    onClick();
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={handleClick}
        className={`relative focus:outline-none focus:ring-4 focus:ring-smokelog-blue-light/50 rounded-full transition-transform duration-150 ${
          isPressed ? 'scale-95' : 'scale-100'
        }`}
        aria-label={`Añadir una ${unit.slice(0, -1)}`}
      >
        {/* Outer circle container - increased size and padding to prevent stroke cutoff */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 p-10 overflow-visible">
          {/* Progress ring - transparent interior, thicker stroke */}
          <svg className="absolute inset-10 w-[calc(100%-5rem)] h-[calc(100%-5rem)] -rotate-90" style={{ overflow: 'visible' }}>
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="18"
            />
            {/* Progress ring (colored) */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke={getProgressColor()}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Inner content */}
          <div className="absolute inset-10 flex flex-col items-center justify-center">
            {/* Count number */}
            <div className="text-6xl sm:text-7xl font-bold text-gray-900 mb-1 transition-all duration-300">
              {count}
            </div>

            {/* Target display */}
            <div className="text-2xl sm:text-3xl font-semibold text-gray-400 mb-2">
              / {target}
            </div>

            {/* Unit label */}
            <div className="text-base sm:text-lg text-gray-500 font-medium">
              {unit} hoy
            </div>
          </div>

          {/* Ripple effects */}
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="absolute rounded-full bg-smokelog-blue-light opacity-50 pointer-events-none animate-ripple"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
                animation: 'ripple 0.6s ease-out',
              }}
            />
          ))}
        </div>
      </button>

      {/* Ripple animation */}
      <style>{`
        @keyframes ripple {
          from {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          to {
            width: 300px;
            height: 300px;
            margin-left: -150px;
            margin-top: -150px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
