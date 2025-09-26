import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthComponent from './components/Auth/AuthComponent';
import WeekPlanner from './components/WeekPlanner/WeekPlanner';
import Header from './components/Layout/Header';
import { getWeekStart } from './utils/dateUtils';

function App() {
  const { user, loading } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
      <main className="container mx-auto px-4 py-8">
        <WeekPlanner
          user={user}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
        />
      </main>
    </div>
  );
}

export default App;
