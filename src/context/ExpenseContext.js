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

    default:
      return state;
  }
};

// Initial State
const initialState = [];

// Create Context
const ExpenseContext = createContext();

// Provider Component
const ExpenseProvider = ({ children }) => {
  const [expenses, dispatch] = useReducer(reducer, initialState);
  return (
    <ExpenseContext.Provider value={{ expenses, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export { ExpenseContext, ExpenseProvider };
