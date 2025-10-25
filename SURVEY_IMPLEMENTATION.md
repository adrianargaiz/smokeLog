# SmokeLOG Survey Implementation

## Overview
A comprehensive 8-question onboarding survey for the SmokeLOG app that collects user habits and preferences. The survey appears after the welcome screen and before the main application.

## File Structure

```
src/
├── contexts/
│   └── SurveyContext.tsx          # State management for survey answers
├── components/
│   └── survey/
│       ├── SurveyLayout.tsx       # Wrapper with progress bar, back, skip
│       ├── PickerWheel.tsx        # Reusable wheel picker for Q5 & Q8
│       ├── Question1.tsx          # Smoking/Vaping selection
│       ├── Question2.tsx          # Goal selection (quit/reduce)
│       ├── Question3.tsx          # Duration
│       ├── Question4.tsx          # Frequency
│       ├── Question5.tsx          # Daily amount (picker)
│       ├── Question6.tsx          # Hardest difficulty
│       ├── Question7.tsx          # Affected life area
│       └── Question8.tsx          # Monthly spending (picker)
├── views/
│   └── SurveyView.tsx             # Main survey controller
├── types/
│   └── index.ts                   # SurveyAnswers interface
└── App.tsx                        # Integration point
```

## Survey Flow

### Navigation Sequence
1. **WelcomeView** → User clicks "Empecemos"
2. **SurveyView** → 8 questions with navigation
3. **Main App** → After survey completion

### User Experience
- **Progress Bar**: Visual indicator showing X/8 completion
- **Back Button**: Navigate to previous question (disabled on Q1)
- **Skip Button**: Skip current question without answering
- **Next Button**: Proceed to next question (disabled if unanswered)
- **Finish Button**: Complete survey on Q8

## Survey Questions

### Question 1: Type Selection (CRITICAL)
**Spanish**: ¿Con qué te gustaría que te ayudemos?
**English**: What would you like support with?

**Options**:
- Dejar de fumar (🚬)
- Dejar de vapear (💨)

**Purpose**: Determines measurement unit throughout app
- `fumar` → measures "cigarros" (cigarettes)
- `vapear` → measures "caladas" (puffs/hits)

**Storage**: `q1_type: 'fumar' | 'vapear'`

---

### Question 2: Goal Selection (CRITICAL)
**Spanish**: ¿Cuál es tu objetivo?
**English**: What's your goal right now?

**Options**:
- Dejarlo por completo (🔴)
- Rebajar la cantidad (📉)

**Purpose**: Determines plan strategy
- `complete` → total eradication plan
- `reduce` → gradual reduction plan

**Storage**: `q2_goal: 'complete' | 'reduce'`

---

### Question 3: Duration
**Spanish**: ¿Cuánto tiempo llevas fumando/vapeando?
**English**: How long have you been smoking/vaping?

**Options**:
- Menos de un mes (🌱)
- 1-6 meses (🌿)
- 6-12 meses (🌳)
- 1-2 años (🌲)
- Más de 2 años (🌋)

**Storage**: `q3_duration: string`

---

### Question 4: Frequency
**Spanish**: ¿Cada cuánto fumas/vapeas?
**English**: How often do you smoke/vape?

**Options**:
- De vez en cuando (🟢)
- Unas pocas veces al día (☁️)
- Constantemente (🚭)
- Solo de fiesta (🎉)

**Storage**: `q4_frequency: string`

---

### Question 5: Daily Amount (CRITICAL - Picker Wheel)
**Spanish**: ¿Cuántas caladas/cigarros consumes al día?
**English**: How many puffs/cigarettes do you consume per day?

**UI**: Wheel picker with scroll-to-select
**Range**:
- 10 to 200 in steps of 10
- 250 to 400 in steps of 50

**Note**: Shows "caladas" or "cigarros" based on Q1 answer
**Helper Text**: "1 cigarro = 10 caladas" (if smoking)

**Purpose**: Establishes baseline for reduction calculations

**Storage**: `q5_dailyAmount: number`

---

### Question 6: Hardest Difficulty
**Spanish**: ¿Qué es lo más difícil de dejar de fumar/vapear?
**English**: What's the hardest part about quitting?

**Options**:
- Antojos (😤)
- Estrés (😣)
- Presión social (🧑)
- Aburrimiento (😐)
- Ansiedad (😔)
- No estoy seguro (🤔)

**Storage**: `q6_difficulty: string`

---

### Question 7: Affected Life Area
**Spanish**: ¿Qué parte de tu vida se ve más afectada por el vapeo/tabaquismo?
**English**: Which part of your life is most affected?

**Options**:
- Mi salud (🩺)
- Mi salud mental (🧠)
- Mi dinero (💸)
- Mis relaciones (🤝)
- Mi energía y concentración (⚡)

**Storage**: `q7_affectedArea: string`

---

### Question 8: Monthly Spending (Picker Wheel)
**Spanish**: ¿Cuánto te gastas en un mes?
**English**: How much do you spend per month?

**UI**: Wheel picker with scroll-to-select
**Values**: €50, €100, €150, €200, €250, €300, €400, €500, €750, €1000+

**Storage**: `q8_monthlySpending: number`

---

## Data Structure

```typescript
interface SurveyAnswers {
  q1_type: 'fumar' | 'vapear' | null;
  q2_goal: 'complete' | 'reduce' | null;
  q3_duration: string | null;
  q4_frequency: string | null;
  q5_dailyAmount: number | null;
  q6_difficulty: string | null;
  q7_affectedArea: string | null;
  q8_monthlySpending: number | null;
}
```

## State Management

### SurveyContext
Provides centralized state management using React Context API.

**Methods**:
- `setAnswer(key, value)` - Update specific answer
- `nextQuestion()` - Move to next question
- `previousQuestion()` - Move to previous question
- `skipQuestion()` - Skip current question
- `goToQuestion(n)` - Jump to specific question
- `resetSurvey()` - Clear all answers

**State**:
- `answers: SurveyAnswers` - All survey responses
- `currentQuestion: number` - Current question (1-8)

## Storage

### LocalStorage Keys
```javascript
// Survey completion flag
localStorage.setItem('smokelog_survey_completed', 'true');

// Survey answers (JSON)
localStorage.setItem('smokelog_survey_answers', JSON.stringify(answers));
```

### Retrieval Example
```javascript
const answers = JSON.parse(localStorage.getItem('smokelog_survey_answers'));
const smokeType = answers.q1_type; // 'fumar' or 'vapear'
const dailyAmount = answers.q5_dailyAmount; // number
```

## Critical Data Points

### For App Logic

1. **Measurement Unit** (Q1)
   - Use `q1_type` to determine if tracking "cigarros" or "caladas"
   - Update all UI labels accordingly

2. **Plan Type** (Q2)
   - Use `q2_goal` to determine reduction strategy
   - "complete": aggressive reduction to zero
   - "reduce": gradual reduction to comfortable level

3. **Baseline Amount** (Q5)
   - Use `q5_dailyAmount` as starting point
   - Calculate daily/weekly reduction targets
   - Track progress against this baseline

## Styling

### Color Palette
- **Progress Bar**: Blue gradient (`from-blue-400 to-blue-500`)
- **Selected Options**: Blue (`bg-blue-400`)
- **Unselected Options**: Gray (`bg-gray-100`)
- **Background**: Light gradient (`from-gray-50 to-white`)

### Typography
- **Question Titles**: 3xl, bold, gray-900
- **Option Text**: lg, medium
- **Helper Text**: base, gray-400

### Spacing
- **Question padding**: px-6, pt-12, pb-32
- **Option gaps**: space-y-4
- **Button padding**: py-5, px-6

### Interactions
- **Active states**: scale-[0.98]
- **Selected states**: scale-[1.02]
- **Hover**: opacity/background changes
- **Transitions**: 200ms duration

## Component Props

### SurveyLayout
```typescript
interface SurveyLayoutProps {
  children: ReactNode;
  currentQuestion: number;
  totalQuestions: number;
  onBack?: () => void;
  onSkip?: () => void;
  showBackButton?: boolean;
  showSkipButton?: boolean;
}
```

### PickerWheel
```typescript
interface PickerWheelProps {
  values: (number | string)[];
  selectedValue: number | string;
  onChange: (value: number | string) => void;
  formatter?: (value: number | string) => string;
}
```

## Integration with Main App

### App.tsx Flow
```javascript
1. Initialize database
2. Check if welcome seen → Show WelcomeView
3. Check if survey completed → Show SurveyView
4. Show main app (HomeView with navigation)
```

### Accessing Survey Data in App
```javascript
const handleSurveyComplete = (answers: SurveyAnswers) => {
  // Save to database/context
  // Initialize user settings based on answers
  // Set up reduction plan
  console.log('Survey completed:', answers);
};
```

## Future Enhancements

1. **Validation**: Add more robust answer validation
2. **Analytics**: Track which questions users skip most
3. **Conditional Logic**: Show different questions based on previous answers
4. **Progress Saving**: Save progress mid-survey
5. **Edit Answers**: Allow users to review/edit after completion
6. **Onboarding Tips**: Show helpful tips between questions
7. **Animations**: Add transition animations between questions
8. **A/B Testing**: Test different question phrasings

## Testing Checklist

- [ ] All 8 questions display correctly
- [ ] Progress bar updates on each question
- [ ] Back button works (disabled on Q1)
- [ ] Skip button advances to next question
- [ ] Next button disabled when question unanswered
- [ ] Picker wheels scroll smoothly
- [ ] Picker values match specifications
- [ ] Spanish text displays correctly
- [ ] Emojis render on all devices
- [ ] Data saves to localStorage
- [ ] Survey completion redirects to main app
- [ ] Survey can be reset/restarted
- [ ] Responsive on small screens (320px)
- [ ] Responsive on large screens (428px+)
- [ ] Touch targets meet 44px minimum
- [ ] No console errors

## Accessibility

- **Keyboard Navigation**: All buttons are keyboard accessible
- **Screen Readers**: Semantic HTML structure
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Color Contrast**: Sufficient contrast ratios maintained
- **Focus States**: Clear visual focus indicators

## Performance

- **Bundle Size**: Minimal dependencies (React Context only)
- **Render Optimization**: Efficient re-rendering with React.memo where needed
- **Smooth Scrolling**: Hardware-accelerated picker wheel
- **Fast Navigation**: Instant question transitions

## Support

For questions or issues with the survey implementation:
1. Check the SurveyContext for state management issues
2. Review individual Question components for UI bugs
3. Verify localStorage is enabled and working
4. Check console for any React errors

---

**Last Updated**: 2025-10-21
**Version**: 1.0.0
**Status**: Production Ready
