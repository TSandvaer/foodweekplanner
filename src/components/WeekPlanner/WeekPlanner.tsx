import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { getWeekDays, getWeekEnd, formatDate, getDayName, getShortDayName, isDayToday } from '../../utils/dateUtils';
import { useMeals } from '../../hooks/useMeals';
import DayColumn from './DayColumn';
import MealModal from '../MealEditor/MealModal';
import ShoppingList from '../ShoppingList/ShoppingList';
import type { Meal } from '../../types';
import { ShoppingCart } from 'lucide-react';

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
  const [selectedDay, setSelectedDay] = useState<Date>(weekDays[0]); // For mobile day selection

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

      {/* Mobile Day Selector */}
      <div className="block lg:hidden mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 px-1">
          {weekDays.map((day) => (
            <button
              key={formatDate(day)}
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border min-w-[80px] transition-all duration-200 ${
                formatDate(selectedDay) === formatDate(day)
                  ? 'border-accent-400 bg-accent-50 dark:bg-accent-900/30 shadow-lg'
                  : isDayToday(day)
                  ? 'border-accent-300/50 bg-accent-50/50 dark:bg-accent-900/10'
                  : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 hover:border-gray-300/50 dark:hover:border-gray-600/50 backdrop-blur-sm'
              }`}
            >
              <div className={`text-xs font-semibold uppercase tracking-wide ${
                formatDate(selectedDay) === formatDate(day) || isDayToday(day)
                  ? 'text-accent-700 dark:text-accent-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {getShortDayName(day)}
              </div>
              <div className={`text-lg font-bold mt-0.5 ${
                formatDate(selectedDay) === formatDate(day) || isDayToday(day)
                  ? 'text-accent-700 dark:text-accent-300'
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {formatDate(day, 'd')}
              </div>
              {isDayToday(day) && (
                <div className="w-1 h-1 bg-accent-500 rounded-full mt-1"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Single Day View */}
      <div className="block lg:hidden">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-soft dark:shadow-soft-dark transition-colors duration-300">
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getDayName(selectedDay)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(selectedDay, 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="p-4">
            <DayColumn
              date={selectedDay}
              meals={getMealsForDate(selectedDay)}
              onAddMeal={() => handleAddMeal(selectedDay)}
              onEditMeal={handleEditMeal}
              isMobile={true}
            />
          </div>
        </div>
      </div>

      {/* Desktop Week Grid */}
      <div className="hidden lg:block">
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
          <div className="grid grid-cols-7 min-h-[400px]">
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