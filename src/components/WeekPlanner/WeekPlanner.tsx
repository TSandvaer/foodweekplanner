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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Plan</h2>
          <p className="text-gray-600 mt-1">Plan your meals for the week</p>
        </div>
        <button
          onClick={() => setShowShoppingList(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Shopping List</span>
        </button>
      </div>

      {/* Week Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={formatDate(day)}
              className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                isDayToday(day) ? 'bg-primary-50' : 'bg-gray-50'
              }`}
            >
              <div className={`text-sm font-medium ${isDayToday(day) ? 'text-primary-700' : 'text-gray-900'}`}>
                {getDayName(day)}
              </div>
              <div className={`text-xs mt-1 ${isDayToday(day) ? 'text-primary-600' : 'text-gray-500'}`}>
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
      <div className="md:hidden">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {weekDays.map((day) => (
            <button
              key={formatDate(day)}
              onClick={() => handleAddMeal(day)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border-2 min-w-[80px] ${
                isDayToday(day)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`text-xs font-medium ${isDayToday(day) ? 'text-primary-700' : 'text-gray-600'}`}>
                {getShortDayName(day)}
              </div>
              <div className={`text-lg font-bold mt-1 ${isDayToday(day) ? 'text-primary-700' : 'text-gray-900'}`}>
                {formatDate(day, 'd')}
              </div>
              <Plus className={`w-4 h-4 mt-1 ${isDayToday(day) ? 'text-primary-600' : 'text-gray-400'}`} />
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