import React from 'react';
import type { Meal } from '../../types';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { deleteMeal } from '../../firebase/firestore';

interface DayColumnProps {
  date: Date;
  meals: Meal[];
  onAddMeal: () => void;
  onEditMeal: (meal: Meal) => void;
  isMobile?: boolean;
}

const DayColumn: React.FC<DayColumnProps> = ({ meals, onAddMeal, onEditMeal, isMobile = false }) => {
  const handleDeleteMeal = async (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteMeal(mealId);
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };

  return (
    <div className={`${isMobile ? '' : 'border-r border-gray-200/30 dark:border-gray-700/30 last:border-r-0 min-h-[400px]'} p-3 flex flex-col transition-colors duration-300`}>
      {/* Meals List */}
      <div className="space-y-2 flex-1">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className={`group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 cursor-pointer hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-200/30 dark:border-gray-700/30 shadow-soft dark:shadow-soft-dark hover:shadow-md dark:hover:shadow-lg ${isMobile ? 'active:scale-95 active:bg-white/90 dark:active:bg-gray-800/90' : ''}`}
            onClick={() => onEditMeal(meal)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                  {meal.title || 'Untitled Meal'}
                </h4>
                {meal.description && (
                  <div
                    className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: meal.description.replace(/<[^>]*>/g, '').substring(0, 50) + (meal.description.length > 50 ? '...' : '')
                    }}
                  />
                )}
                {meal.ingredients.length > 0 && (
                  <div className="text-xs text-accent-600 dark:text-accent-400 mt-1.5 font-medium">
                    {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <div className={`flex items-center space-x-0.5 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all duration-200`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMeal(meal);
                  }}
                  className={`${isMobile ? 'p-2' : 'p-1.5'} text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-all duration-200`}
                  title="Edit meal"
                >
                  <Edit3 className={`${isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
                </button>
                <button
                  onClick={(e) => handleDeleteMeal(meal.id, e)}
                  className={`${isMobile ? 'p-2' : 'p-1.5'} text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200`}
                  title="Delete meal"
                >
                  <Trash2 className={`${isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Meal Button */}
      <button
        onClick={onAddMeal}
        className={`w-full mt-3 ${isMobile ? 'p-4' : 'p-3'} border border-dashed border-gray-300/60 dark:border-gray-600/60 rounded-xl text-gray-500 dark:text-gray-400 hover:border-accent-400/60 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50/50 dark:hover:bg-accent-900/10 transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm active:scale-95`}
      >
        <Plus className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <span className={`${isMobile ? 'text-base' : 'text-sm'} font-medium`}>Add Meal</span>
      </button>
    </div>
  );
};

export default DayColumn;