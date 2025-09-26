export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface Meal {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  date: string; // ISO date string
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}

export interface WeekData {
  startDate: string; // ISO date string for Monday of the week
  meals: Meal[];
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';