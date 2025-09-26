import React, { useState, useMemo } from 'react';
import { X, ShoppingCart, Check, Copy } from 'lucide-react';
import type { Meal, Ingredient } from '../../types';

interface ShoppingListProps {
  meals: Meal[];
  onClose: () => void;
}

interface AggregatedIngredient extends Ingredient {
  sources: string[]; // Meal titles that use this ingredient
}

const ShoppingList: React.FC<ShoppingListProps> = ({ meals, onClose }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const aggregatedIngredients = useMemo(() => {
    const ingredientMap = new Map<string, AggregatedIngredient>();

    meals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const key = ingredient.name.toLowerCase().trim();
        if (key) {
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!;
            existing.sources.push(meal.title);
            // For simplicity, we'll just concatenate quantities
            // In a real app, you might want to parse and combine quantities properly
            existing.quantity = existing.quantity
              ? `${existing.quantity}, ${ingredient.quantity}`.trim()
              : ingredient.quantity;
          } else {
            ingredientMap.set(key, {
              ...ingredient,
              sources: [meal.title]
            });
          }
        }
      });
    });

    return Array.from(ingredientMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [meals]);

  const toggleChecked = (ingredientId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedItems(newChecked);
  };

  const copyToClipboard = async () => {
    const text = aggregatedIngredients
      .map(ingredient => {
        const quantity = ingredient.quantity ? ` (${ingredient.quantity}${ingredient.unit ? ' ' + ingredient.unit : ''})` : '';
        return `• ${ingredient.name}${quantity}`;
      })
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const checkedCount = checkedItems.size;
  const totalCount = aggregatedIngredients.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-soft dark:shadow-soft-dark max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shopping List</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalCount} ingredient{totalCount !== 1 ? 's' : ''} for this week
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-sm shadow-soft"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                {checkedCount} of {totalCount} items collected
              </span>
              <span className="text-accent-600 dark:text-accent-400 font-medium">
                {Math.round((checkedCount / totalCount) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-2">
              <div
                className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Ingredients List */}
        <div className="flex-1 overflow-y-auto p-6">
          {aggregatedIngredients.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No ingredients added to meals yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Add ingredients to your meals to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {aggregatedIngredients.map((ingredient) => {
                const isChecked = checkedItems.has(ingredient.id);
                return (
                  <div
                    key={ingredient.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                      isChecked
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleChecked(ingredient.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${
                        isChecked
                          ? 'text-green-800 dark:text-green-300 line-through'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {ingredient.name}
                      </div>

                      {(ingredient.quantity || ingredient.unit) && (
                        <div className={`text-sm mt-1 ${
                          isChecked ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {ingredient.quantity} {ingredient.unit}
                        </div>
                      )}

                      {ingredient.sources.length > 0 && (
                        <div className={`text-xs mt-1 ${
                          isChecked ? 'text-green-500 dark:text-green-500' : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          Used in: {ingredient.sources.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check items as you shop to track progress
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors shadow-soft"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;