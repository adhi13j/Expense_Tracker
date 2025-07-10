import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper to get today's date in "YYYY-MM-DD"
const getToday = () => new Date().toISOString().split("T")[0];

// Reducer Function
const reducer = (state, action) => {
  const today = getToday();

  switch (action.type) {
   // case "loadHistory":
     // return action.payload;

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
const initialState = [
  {
    date: "2025-07-10", // Today - 4 normal expenses
    expenses: [
      { id: "710001", activity: "Coffee", category: "Food", price: "₹120" },
      {
        id: "710002",
        activity: "Auto Rickshaw",
        category: "Transport",
        price: "₹80",
      },
      {
        id: "710003",
        activity: "Mobile Recharge",
        category: "Utilities",
        price: "₹199",
      },
      {
        id: "710004",
        activity: "Notebook",
        category: "Stationery",
        price: "₹70",
      },
    ],
  },
  {
    date: "2025-07-09", // No expenses
    expenses: [],
  },
  {
    date: "2025-07-08", // No expenses
    expenses: [],
  },
  {
    date: "2025-07-07", // Heavy spending day
    expenses: [
      {
        id: "707001",
        activity: "Smartphone Purchase",
        category: "Electronics",
        price: "₹22000",
      },
      {
        id: "707002",
        activity: "Dinner at Restaurant",
        category: "Food",
        price: "₹1800",
      },
      {
        id: "707003",
        activity: "Cab to Airport",
        category: "Transport",
        price: "₹900",
      },
    ],
  },
  {
    date: "2025-07-06", // Heavy spending day
    expenses: [
      {
        id: "706001",
        activity: "TV Subscription",
        category: "Entertainment",
        price: "₹999",
      },
      { id: "706002", activity: "Grocery", category: "Food", price: "₹1600" },
      {
        id: "706003",
        activity: "Electricity Bill",
        category: "Utilities",
        price: "₹3500",
      },
    ],
  },
  {
    date: "2025-07-05", // Grocery only
    expenses: [
      { id: "705001", activity: "Groceries", category: "Food", price: "₹550" },
    ],
  },
  {
    date: "2025-07-04", // Average day
    expenses: [
      { id: "704001", activity: "Milk", category: "Food", price: "₹70" },
      {
        id: "704002",
        activity: "Internet",
        category: "Utilities",
        price: "₹799",
      },
    ],
  },
  {
    date: "2025-07-03", // Average day
    expenses: [
      {
        id: "703001",
        activity: "Bus Pass",
        category: "Transport",
        price: "₹300",
      },
      { id: "703002", activity: "Snacks", category: "Food", price: "₹150" },
    ],
  },
  {
    date: "2025-07-02", // Average day
    expenses: [
      { id: "702001", activity: "Book", category: "Stationery", price: "₹450" },
    ],
  },
  {
    date: "2025-07-01", // Average day
    expenses: [
      { id: "701001", activity: "Gym Fee", category: "Health", price: "₹600" },
      { id: "701002", activity: "Lunch", category: "Food", price: "₹200" },
    ],
  },
];

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
