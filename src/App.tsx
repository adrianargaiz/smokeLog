import { useState, useEffect } from 'react';
import type { ViewType, SurveyAnswers } from './types';
import { initializeDatabase } from './lib/database';
import { StatusBar } from '@capacitor/status-bar';
import WelcomeView from './views/WelcomeView';
import SurveyView from './views/SurveyView';
import HomeView from './views/HomeView';
import PlanView from './views/PlanView';
import StatisticsView from './views/StatisticsView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';
import BottomNav from './components/BottomNav';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);

  useEffect(() => {
    // Hide status bar on app load
    const hideStatusBar = async () => {
      try {
        await StatusBar.hide();
      } catch (error) {
        console.log('StatusBar not available:', error);
      }
    };

    hideStatusBar();

    // Check if user has seen welcome screen
    const welcomeSeen = localStorage.getItem('smokelog_welcome_seen');
    if (welcomeSeen === 'true') {
      setHasSeenWelcome(true);
    }

    // Check if user has completed survey
    const surveySeen = localStorage.getItem('smokelog_survey_completed');
    if (surveySeen === 'true') {
      setHasCompletedSurvey(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    init();
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem('smokelog_welcome_seen', 'true');
    setHasSeenWelcome(true);
  };

  const handleSurveyComplete = (answers: SurveyAnswers) => {
    console.log('Survey completed with answers:', answers);
    setHasCompletedSurvey(true);
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-smokelog-blue-soft to-smokelog-blue-pale">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-smokelog-yellow-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Inicializando...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen on first launch
  if (!hasSeenWelcome) {
    return <WelcomeView onComplete={handleWelcomeComplete} />;
  }

  // Show survey after welcome, before main app
  if (!hasCompletedSurvey) {
    return <SurveyView onComplete={handleSurveyComplete} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content - No overflow blocking here, each view controls its own scroll */}
      <main>
        {currentView === 'home' && (
          <HomeView
            onNavigateToHistory={() => setCurrentView('history')}
            onNavigateToProfile={() => setCurrentView('profile')}
          />
        )}
        {currentView === 'history' && <PlanView onNavigateToProfile={() => setCurrentView('profile')} />}
        {currentView === 'statistics' && <StatisticsView onNavigateToProfile={() => setCurrentView('profile')} />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'profile' && <ProfileView onBack={() => setCurrentView('home')} />}
      </main>

      {/* Bottom Navigation - Hidden on profile view */}
      {currentView !== 'profile' && (
        <BottomNav activeView={currentView} onNavigate={setCurrentView} />
      )}
    </div>
  );
}

export default App;
