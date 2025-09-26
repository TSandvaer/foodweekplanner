import React from 'react';
import type { Meal } from '../../types';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { deleteMeal } from '../../firebase/firestore';

interface DayColumnProps {
  date: Date;
  meals: Meal[];
  onAddMeal: () => void;
  onEditMeal: (meal: Meal) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ meals, onAddMeal, onEditMeal }) => {
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
    <div className="border-r border-gray-200 last:border-r-0 p-4 min-h-[400px] flex flex-col">
      {/* Meals List */}
      <div className="space-y-3 flex-1">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="group bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
            onClick={() => onEditMeal(meal)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {meal.title || 'Untitled Meal'}
                </h4>
                {meal.description && (
                  <div
                    className="text-xs text-gray-600 mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: meal.description.replace(/<[^>]*>/g, '').substring(0, 60) + '...'
                    }}
                  />
                )}
                {meal.ingredients.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMeal(meal);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit meal"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteMeal(meal.id, e)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete meal"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Meal Button */}
      <button
        onClick={onAddMeal}
        className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add Meal</span>
      </button>
    </div>
  );
};

export default DayColumn;