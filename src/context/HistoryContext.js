import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper to get today's date in "YYYY-MM-DD"
const getToday = () => new Date().toISOString().split("T")[0];

// Reducer Function
const reducer = (state, action) => {
  const today = getToday();

  switch (action.type) {
    case "loadHistory":
      return action.payload;

    case "saveExpense": {
      const newExpense = action.payload;
      const updated = [...state];
      const existingDate = updated.find((entry) => entry.date === today);

      if (existingDate) {
        existingDate.expenses.push(newExpense);
      } else {
        updated.unshift({
          date: today,
          expenses: [newExpense],
        });
      }

      return updated;
    }

    case "deleteExpense": {
      const updated = state
        .map((entry) => ({
          ...entry,
          expenses: entry.expenses.filter((exp) => exp.id !== action.payload),
        }))
        .filter((entry) => entry.expenses.length > 0);
      return updated;
    }

    case "editExpense": {
      const { id, updatedExpense } = action.payload;
      return state.map((entry) => {
        const idx = entry.expenses.findIndex((exp) => exp.id === id);
        if (idx !== -1) {
          const newExpenses = [...entry.expenses];
          newExpenses[idx] = updatedExpense;
          return { ...entry, expenses: newExpenses };
        }
        return entry;
      });
    }

    case "clearAll":
      return [];

    default:
      return state;
  }
};

// Initial state
const initialState = [];

// Create Context
const HistoryContext = createContext();

// Provider Component
const HistoryProvider = ({ children }) => {
  const [history, dispatch] = useReducer(reducer, initialState);

  // Load from AsyncStorage on first mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem("@history");
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: "loadHistory", payload: parsed });
        }
      } catch (err) {
        console.error("Failed to load history from storage", err);
      }
    };
    loadHistory();
  }, []);

  // Save to AsyncStorage whenever history changes
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem("@history", JSON.stringify(history));
      } catch (err) {
        console.error("Failed to save history", err);
      }
    };
    saveHistory();
  }, [history]);

  return (
    <HistoryContext.Provider value={{ history, dispatch }}>
      {children}
    </HistoryContext.Provider>
  );
};

export { HistoryContext, HistoryProvider };

export const getTodayExpenses = (history) => {
  const today = new Date().toISOString().split("T")[0];
  const entry = history.find((h) => h.date === today);
  return entry ? entry.expenses : [];
};
