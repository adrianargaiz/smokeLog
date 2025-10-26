import { useContext } from 'react';
import { SurveyContext } from '../contexts/SurveyContext';

/**
 * Hook to access the Survey context
 * Must be used within a SurveyProvider
 */
export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
