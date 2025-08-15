import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to safely convert a value to a Date object
export function toDate(value: any): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
  if (value && typeof value === 'object' && value.__type === 'Date' && value.value) {
    return new Date(value.value);
  }
  // Fallback to current date if value is invalid
  return new Date();
}
