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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-primary-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Shopping List</h2>
              <p className="text-sm text-gray-600">
                {totalCount} ingredient{totalCount !== 1 ? 's' : ''} needed for this week
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {checkedCount} of {totalCount} items collected
              </span>
              <span className="text-gray-600">
                {Math.round((checkedCount / totalCount) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Ingredients List */}
        <div className="flex-1 overflow-y-auto p-6">
          {aggregatedIngredients.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No ingredients added to meals yet</p>
              <p className="text-gray-400 text-sm mt-1">
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
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => toggleChecked(ingredient.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${isChecked ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                        {ingredient.name}
                      </div>

                      {(ingredient.quantity || ingredient.unit) && (
                        <div className={`text-sm mt-1 ${isChecked ? 'text-green-600' : 'text-gray-600'}`}>
                          {ingredient.quantity} {ingredient.unit}
                        </div>
                      )}

                      {ingredient.sources.length > 0 && (
                        <div className={`text-xs mt-1 ${isChecked ? 'text-green-500' : 'text-gray-500'}`}>
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
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Tip: Check off items as you shop to track your progress
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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