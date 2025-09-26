import { useState, useEffect, useMemo } from 'react';
import type { Meal } from '../types';
import { subscribeTomeals } from '../firebase/firestore';
import { formatDate } from '../utils/dateUtils';

export const useMeals = (userId: string | null, weekStart: Date, weekEnd: Date) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert dates to strings to avoid infinite re-renders
  const startDateStr = useMemo(() => formatDate(weekStart), [weekStart]);
  const endDateStr = useMemo(() => formatDate(weekEnd), [weekEnd]);

  useEffect(() => {
    if (!userId) {
      setMeals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeTomeals(
      userId,
      startDateStr,
      endDateStr,
      (mealsData) => {
        setMeals(mealsData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, startDateStr, endDateStr]);

  const getMealsForDate = (date: Date): Meal[] => {
    const dateStr = formatDate(date);
    return meals.filter(meal => meal.date === dateStr);
  };

  return {
    meals,
    loading,
    error,
    getMealsForDate
  };
};