import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import AddExpenseScreen from "./src/screens/AddExpenseScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ManageCategories from "./src/screens/HelperScreens/ManageCategories";
import { ExpenseProvider } from "./src/context/ExpenseContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ManageCategories" component={ManageCategories} />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}
