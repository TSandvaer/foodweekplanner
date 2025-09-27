import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, LogOut, Home, Sun, Moon } from 'lucide-react';
import { signOut } from '../../firebase/auth';
import { navigateWeek, formatWeekRange, getWeekStart, isCurrentWeek } from '../../utils/dateUtils';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
}

const Header: React.FC<HeaderProps> = ({ currentWeek, setCurrentWeek }) => {
  const { theme, toggleTheme } = useTheme();
  const handleNavigate = (direction: 'prev' | 'next') => {
    const newWeek = navigateWeek(currentWeek, direction);
    setCurrentWeek(newWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(getWeekStart(new Date()));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-semibold">🍽️</span>
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white tracking-tight hidden xs:block">
              Food Week Planner
            </h1>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white tracking-tight block xs:hidden">
              FWP
            </h1>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Week Navigation */}
            <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-soft dark:shadow-soft-dark">
              <button
                onClick={() => handleNavigate('prev')}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                title="Previous week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 border-x border-gray-200/50 dark:border-gray-700/50">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-accent-500 hidden sm:block" />
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[100px] sm:min-w-[130px] text-center">
                  {formatWeekRange(currentWeek)}
                </span>
              </div>

              <button
                onClick={() => handleNavigate('next')}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                title="Next week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Current Week Button */}
            {!isCurrentWeek(currentWeek) && (
              <button
                onClick={goToCurrentWeek}
                className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 bg-accent-500 text-white text-xs sm:text-sm rounded-lg hover:bg-accent-600 transition-colors shadow-soft"
                title="Go to current week"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium hidden sm:inline">Today</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200/50 dark:border-gray-700/50 shadow-soft dark:shadow-soft-dark"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* <div className="hidden md:block text-right bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50 shadow-soft dark:shadow-soft-dark">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                  {user.displayName || user.email?.split('@')[0]}
                </p>
              </div> */}
              <button
                onClick={handleSignOut}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-soft dark:shadow-soft-dark"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;