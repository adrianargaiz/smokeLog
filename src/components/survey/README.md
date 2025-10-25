# Survey Components

## Overview
This directory contains all components for the SmokeLOG 8-question onboarding survey.

## Components

### SurveyLayout
Wrapper component providing consistent layout for all questions.
- Progress bar (X/8)
- Back button (disabled on Q1)
- Skip button
- Mobile-optimized spacing

### PickerWheel
Reusable iOS-style wheel picker with smooth scrolling.
Used by Question5 and Question8.

### Question1 - Question8
Individual question components, each handling their specific question logic.

## Usage

```typescript
import SurveyView from '@/views/SurveyView';

function App() {
  const handleSurveyComplete = (answers) => {
    console.log('Survey complete:', answers);
  };

  return <SurveyView onComplete={handleSurveyComplete} />;
}
```

## Data Access

```typescript
import { getSurveyAnswers, getMeasurementUnit } from '@/utils/surveyHelpers';

const answers = getSurveyAnswers();
const unit = getMeasurementUnit(); // "cigarros" or "caladas"
```

## Critical Questions

- **Q1**: Determines measurement unit (cigarros vs caladas)
- **Q2**: Determines plan type (quit vs reduce)
- **Q5**: Baseline amount for calculations

See `SURVEY_IMPLEMENTATION.md` for complete documentation.
