import React, { createContext, useReducer } from "react";

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "Add_Expense":
      return [
        ...state,
        {
          id: Date.now().toString(),
          activity: action.payload.activity,
          category: action.payload.category,
          price: action.payload.price,
        },
      ];

    case "Remove_Expense":
      return state.filter((item) => item.id !== action.payload.id);

    case "Edit_Expense":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
    case "Load_Initial":
      return action.payload;
    case "Clear_All":
      return [];
    default:
      return state;
  }
};
const initialState = [
  { id: "1", activity: "Groceries", category: "Food", price: "₹250" },
  { id: "2", activity: "Uber Ride", category: "Transport", price: "₹180" },
  { id: "3", activity: "Coffee", category: "Food", price: "₹60" },
  {
    id: "4",
    activity: "Mobile Recharge",
    category: "Utilities",
    price: "₹149",
  },
  { id: "5", activity: "Notebook", category: "Stationery", price: "₹120" },
];

// Create Context
const ExpenseContext = createContext();
import { useContext, useEffect } from "react";
import { HistoryContext, getTodayExpenses } from "./HistoryContext";

const ExpenseProvider = ({ children }) => {
  const [expenses, dispatch] = useReducer(reducer, []);
  const { history } = useContext(HistoryContext);

  useEffect(() => {
    const todayExpenses = getTodayExpenses(history);
    dispatch({ type: "Load_Initial", payload: todayExpenses });
  }, [history]); // Make sure history is already populated before this

  return (
    <ExpenseContext.Provider value={{ expenses, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
};


export { ExpenseContext, ExpenseProvider };
