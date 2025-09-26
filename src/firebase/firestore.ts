import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { Meal, Ingredient } from '../types';
import { v4 as uuidv4 } from 'uuid';

const MEALS_COLLECTION = 'meals';

export const createMeal = async (meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const newMeal = {
      ...meal,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, MEALS_COLLECTION), newMeal);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateMeal = async (mealId: string, updates: Partial<Meal>) => {
  try {
    const mealRef = doc(db, MEALS_COLLECTION, mealId);
    await updateDoc(mealRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteMeal = async (mealId: string) => {
  try {
    const mealRef = doc(db, MEALS_COLLECTION, mealId);
    await deleteDoc(mealRef);
  } catch (error) {
    throw error;
  }
};

export const getUserMeals = async (userId: string, startDate: string, endDate: string) => {
  try {
    // Simplified query to avoid composite index requirement
    const q = query(
      collection(db, MEALS_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const meals: Meal[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const meal = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Meal;

      // Filter by date range in client-side code
      if (meal.date >= startDate && meal.date <= endDate) {
        meals.push(meal);
      }
    });

    // Sort by date client-side
    meals.sort((a, b) => a.date.localeCompare(b.date));
    return meals;
  } catch (error) {
    throw error;
  }
};

export const subscribeTomeals = (
  userId: string,
  startDate: string,
  endDate: string,
  callback: (meals: Meal[]) => void
) => {
  // Simplified query to avoid composite index requirement
  const q = query(
    collection(db, MEALS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (querySnapshot) => {
    const meals: Meal[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const meal = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Meal;

      // Filter by date range in client-side code
      if (meal.date >= startDate && meal.date <= endDate) {
        meals.push(meal);
      }
    });

    // Sort by date client-side
    meals.sort((a, b) => a.date.localeCompare(b.date));
    callback(meals);
  });
};

export const addIngredientToMeal = async (mealId: string, ingredient: Omit<Ingredient, 'id'>) => {
  try {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: uuidv4(),
    };

    // Note: You'll need to implement getting current ingredients and updating
    // This is a simplified version
    await updateMeal(mealId, { updatedAt: new Date() });

    return newIngredient;
  } catch (error) {
    throw error;
  }
};