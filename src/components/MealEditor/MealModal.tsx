import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import type { Meal, Ingredient } from '../../types';
import { createMeal, updateMeal } from '../../firebase/firestore';
import { formatDate } from '../../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';

interface MealModalProps {
  meal?: Meal | null;
  date?: Date | null;
  userId: string;
  onClose: () => void;
}

const MealModal: React.FC<MealModalProps> = ({ meal, date, userId, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (meal) {
      setTitle(meal.title);
      setDescription(meal.description);
      setIngredients(meal.ingredients || []);
    } else {
      setTitle('');
      setDescription('');
      setIngredients([]);
    }
  }, [meal]);

  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: uuidv4(),
      name: '',
      quantity: '',
      unit: ''
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    ));
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a meal title');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const mealData = {
        title: title.trim(),
        description: description.trim(),
        ingredients: ingredients.filter(ing => ing.name.trim()),
        userId,
        date: meal ? meal.date : formatDate(date!)
      };

      if (meal) {
        await updateMeal(meal.id, mealData);
      } else {
        await createMeal(mealData);
      }

      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to save meal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl shadow-soft dark:shadow-soft-dark max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transition-colors duration-300">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {meal ? 'Edit Meal' : 'Add New Meal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl text-red-700 dark:text-red-300 text-sm shadow-soft">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meal Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              placeholder="Enter meal title"
            />
          </div>

          {/* Description with TinyMCE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description & Recipe
            </label>
            <div className="border border-gray-200/50 dark:border-gray-600/50 rounded-xl overflow-hidden shadow-soft dark:shadow-soft-dark">
              <Editor
                apiKey="cbrus89d52lj99swxvng16fylvy6bby4cfmhe43mwxn1hpr9"
                licenseKey="gpl"
                value={description}
                onEditorChange={(content) => setDescription(content)}
                init={{
                  height: window.innerWidth < 640 ? 200 : 300,
                  menubar: false,
                  branding: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'table', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image | help',
                  content_style: 'body { font-family: system-ui, sans-serif; font-size: 14px; color: #374151; } body.dark { color: #f3f4f6; }',
                  // Base64 image upload for persistent embedded images
                  images_upload_handler: (blobInfo: any) => {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        resolve(reader.result as string);
                      };
                      reader.onerror = () => {
                        reject('Image upload failed');
                      };
                      reader.readAsDataURL(blobInfo.blob());
                    });
                  },
                  // Allow automatic uploads
                  automatic_uploads: true,
                  // Set upload timeout
                  images_upload_timeout: 30000,
                  // Allow pasting images
                  paste_data_images: true
                }}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ingredients
              </label>
              <button
                onClick={handleAddIngredient}
                className="flex items-center space-x-1 px-3 py-1 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleUpdateIngredient(ingredient.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="Ingredient name"
                    />
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) => handleUpdateIngredient(ingredient.id, 'quantity', e.target.value)}
                      className="flex-1 sm:w-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="Qty"
                    />
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => handleUpdateIngredient(ingredient.id, 'unit', e.target.value)}
                      className="flex-1 sm:w-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="Unit"
                    />
                    <button
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                      className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {ingredients.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No ingredients added yet</p>
                  <button
                    onClick={handleAddIngredient}
                    className="mt-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 text-sm font-medium transition-colors"
                  >
                    Add your first ingredient
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-soft"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50 shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Meal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealModal;