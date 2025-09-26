import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthComponent from './components/Auth/AuthComponent';
import WeekPlanner from './components/WeekPlanner/WeekPlanner';
import Header from './components/Layout/Header';
import { getWeekStart } from './utils/dateUtils';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const { user, loading } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-app-light dark:bg-app-dark transition-colors duration-300">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 border-2 border-accent-500 mx-auto mb-4 relative">
              <div className="animate-spin rounded-full h-full w-full border-b-2 border-accent-500"></div>
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">🍽️ Food Week Planner</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Loading your meal plans...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-app-light dark:bg-app-dark transition-colors duration-300">
          <AuthComponent />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-app-light dark:bg-app-dark transition-colors duration-300">
        <div className="flex flex-col min-h-screen">
          <Header user={user} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
            <WeekPlanner
              user={user}
              currentWeek={currentWeek}
              setCurrentWeek={setCurrentWeek}
            />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
