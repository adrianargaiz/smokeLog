import { useRef, useEffect, useState } from 'react';

interface PickerWheelProps {
  values: (number | string)[];
  selectedValue: number | string;
  onChange: (value: number | string) => void;
  formatter?: (value: number | string) => string;
}

/**
 * PickerWheel - iOS-style wheel picker for selecting values
 *
 * Features:
 * - Smooth scrolling with snap-to-center behavior
 * - Touch-friendly for mobile devices
 * - Visual highlighting of selected item
 * - Gradient fade effect at top and bottom
 * - Customizable value formatting
 */
export default function PickerWheel({
  values,
  selectedValue,
  onChange,
  formatter = (val) => String(val),
}: PickerWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const itemHeight = 56; // Height of each item in pixels

  // Scroll to selected value on mount or when selectedValue changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectedIndex = values.findIndex((val) => val === selectedValue);
    if (selectedIndex !== -1) {
      // Center the selected item
      const scrollPosition = selectedIndex * itemHeight;
      container.scrollTop = scrollPosition;
    }
  }, [selectedValue, values, itemHeight]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || isDragging) return;

    // Snap to nearest item
    const scrollTop = container.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(selectedIndex, values.length - 1));

    if (values[clampedIndex] !== selectedValue) {
      onChange(values[clampedIndex]);
    }

    // Smooth snap to center
    container.scrollTop = clampedIndex * itemHeight;
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    handleScroll();
  };

  const handleItemClick = (value: number | string) => {
    onChange(value);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Selection Indicator - Highlighted Background */}
      <div
        className="absolute left-0 right-0 bg-gray-200 rounded-xl pointer-events-none z-0"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: `${itemHeight}px`,
        }}
      />

      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="h-64 overflow-y-scroll scrollbar-hide relative z-10"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          scrollSnapType: 'y mandatory',
          paddingTop: `${itemHeight * 2}px`, // 2 items padding above
          paddingBottom: `${itemHeight * 2}px`, // 2 items padding below
        }}
      >
        {values.map((value, index) => {
          const isSelected = value === selectedValue;
          return (
            <div
              key={`${value}-${index}`}
              className={`flex items-center justify-center transition-all duration-200 cursor-pointer relative`}
              style={{
                height: `${itemHeight}px`,
                scrollSnapAlign: 'center',
              }}
              onClick={() => handleItemClick(value)}
            >
              <span
                className={`text-2xl font-semibold transition-all duration-200 relative z-10 ${
                  isSelected
                    ? 'text-gray-900 scale-110'
                    : 'text-gray-400 scale-90'
                }`}
                style={{
                  color: isSelected ? '#1f2937' : '#9ca3af',
                }}
              >
                {formatter(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
