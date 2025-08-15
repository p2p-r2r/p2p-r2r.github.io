import { AppState } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEY = 'manuscript-response-hub-state';

// Helper function to serialize dates for localStorage
function serializeState(state: AppState): string {
  return JSON.stringify(state, (key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
}

// Helper function to deserialize dates from localStorage
function deserializeState(data: string): AppState {
  const parsed = JSON.parse(data, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date' && value.value) {
      return new Date(value.value);
    }
    return value;
  });

  // Additional safety check: ensure all date fields are actually Date objects
  const ensureDates = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      const result = { ...obj };
      for (const [key, value] of Object.entries(result)) {
        if (key === 'createdAt' || key === 'updatedAt') {
          if (!(value instanceof Date)) {
            result[key] = new Date(value as string);
          }
        } else if (Array.isArray(value)) {
          result[key] = value.map(ensureDates);
        } else if (value && typeof value === 'object') {
          result[key] = ensureDates(value);
        }
      }
      return result;
    }
    return obj;
  };

  return ensureDates(parsed);
}

export function saveToLocalStorage(state: AppState): void {
  try {
    const serializedState = serializeState(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
    toast.error('Failed to save data to local storage. Your changes may be lost on page refresh.');
  }
}

export function loadFromLocalStorage(): AppState | null {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return deserializeState(serializedState);
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    toast.error('Failed to load saved data from local storage. Starting with empty state.');
    return null;
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    toast.success('All data cleared successfully');
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    toast.error('Failed to clear local storage data');
  }
}

// Check if localStorage is available
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Export data as JSON file
export function exportData(state: AppState): void {
  try {
    const dataStr = serializeState(state);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manuscript-response-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  } catch (error) {
    console.error('Failed to export data:', error);
    toast.error('Failed to export data');
  }
}

// Import data from JSON file
export function importData(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const state = deserializeState(content);
        resolve(state);
        toast.success('Data imported successfully');
      } catch (error) {
        console.error('Failed to import data:', error);
        toast.error('Failed to import data. Please check the file format.');
        reject(error);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
} 