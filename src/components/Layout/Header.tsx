import React from 'react';
import type { User } from 'firebase/auth';
import { ChevronLeft, ChevronRight, Calendar, LogOut, Home } from 'lucide-react';
import { signOut } from '../../firebase/auth';
import { navigateWeek, formatWeekRange, getWeekStart, isCurrentWeek } from '../../utils/dateUtils';

interface HeaderProps {
  user: User;
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentWeek, setCurrentWeek }) => {
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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Food Week Planner</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Week Navigation */}
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => handleNavigate('prev')}
                className="p-2 hover:bg-white rounded-md transition-colors"
                title="Previous week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 px-3 py-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 min-w-[140px] text-center">
                  {formatWeekRange(currentWeek)}
                </span>
              </div>

              <button
                onClick={() => handleNavigate('next')}
                className="p-2 hover:bg-white rounded-md transition-colors"
                title="Next week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Current Week Button */}
            {!isCurrentWeek(currentWeek) && (
              <button
                onClick={goToCurrentWeek}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                title="Go to current week"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Current Week</span>
              </button>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs text-gray-500">Signed in</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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