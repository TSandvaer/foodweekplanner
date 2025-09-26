import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { getWeekDays, getWeekEnd, formatDate, getDayName, getShortDayName, isDayToday } from '../../utils/dateUtils';
import { useMeals } from '../../hooks/useMeals';
import DayColumn from './DayColumn';
import MealModal from '../MealEditor/MealModal';
import ShoppingList from '../ShoppingList/ShoppingList';
import type { Meal } from '../../types';
import { Plus, ShoppingCart } from 'lucide-react';

interface WeekPlannerProps {
  user: User;
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
}

const WeekPlanner: React.FC<WeekPlannerProps> = ({ user, currentWeek }) => {
  const weekEnd = getWeekEnd(currentWeek);
  const weekDays = getWeekDays(currentWeek);
  const { meals, loading, getMealsForDate } = useMeals(user.uid, currentWeek, weekEnd);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const handleAddMeal = (date: Date) => {
    setSelectedDate(date);
    setSelectedMeal(null);
    setShowMealModal(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setSelectedDate(null);
    setShowMealModal(true);
  };

  const handleCloseMealModal = () => {
    setShowMealModal(false);
    setSelectedMeal(null);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-500/30 border-t-accent-500 mx-auto mb-3"></div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Loading your meal plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Weekly Meal Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Plan and organize your meals for the week</p>
        </div>
        <button
          onClick={() => setShowShoppingList(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent-500 text-white text-sm rounded-lg hover:bg-accent-600 transition-colors shadow-soft"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="font-medium">Shopping List</span>
        </button>
      </div>

      {/* Week Grid */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-soft dark:shadow-soft-dark overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          {weekDays.map((day) => (
            <div
              key={formatDate(day)}
              className={`p-3 text-center border-r border-gray-200/30 dark:border-gray-700/30 last:border-r-0 transition-colors ${
                isDayToday(day)
                  ? 'bg-accent-50 dark:bg-accent-900/20'
                  : ''
              }`}
            >
              <div className={`text-xs font-semibold uppercase tracking-wide ${
                isDayToday(day)
                  ? 'text-accent-700 dark:text-accent-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {getDayName(day)}
              </div>
              <div className={`text-xs mt-0.5 ${
                isDayToday(day)
                  ? 'text-accent-600 dark:text-accent-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatDate(day, 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        {/* Days Content */}
        <div className="grid grid-cols-1 md:grid-cols-7 min-h-[400px]">
          {weekDays.map((day) => (
            <DayColumn
              key={formatDate(day)}
              date={day}
              meals={getMealsForDate(day)}
              onAddMeal={() => handleAddMeal(day)}
              onEditMeal={handleEditMeal}
            />
          ))}
        </div>
      </div>

      {/* Mobile Day Selector (shown on small screens) */}
      <div className="md:hidden mt-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {weekDays.map((day) => (
            <button
              key={formatDate(day)}
              onClick={() => handleAddMeal(day)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border min-w-[70px] transition-all duration-200 shadow-soft ${
                isDayToday(day)
                  ? 'border-accent-300/50 bg-accent-50 dark:bg-accent-900/20 shadow-accent-200/50'
                  : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 hover:border-gray-300/50 dark:hover:border-gray-600/50 backdrop-blur-sm'
              }`}
            >
              <div className={`text-xs font-medium ${
                isDayToday(day) ? 'text-accent-700 dark:text-accent-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {getShortDayName(day)}
              </div>
              <div className={`text-lg font-semibold mt-0.5 ${
                isDayToday(day) ? 'text-accent-700 dark:text-accent-300' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {formatDate(day, 'd')}
              </div>
              <Plus className={`w-3 h-3 mt-1 ${
                isDayToday(day) ? 'text-accent-600 dark:text-accent-400' : 'text-gray-400'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showMealModal && (
        <MealModal
          meal={selectedMeal}
          date={selectedDate}
          userId={user.uid}
          onClose={handleCloseMealModal}
        />
      )}

      {showShoppingList && (
        <ShoppingList
          meals={meals}
          onClose={() => setShowShoppingList(false)}
        />
      )}
    </div>
  );
};

export default WeekPlanner;