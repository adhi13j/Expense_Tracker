import AsyncStorage from "@react-native-async-storage/async-storage";

// Save expenses
const saveExpenses = async (expenses) => {
  try {
    const jsonValue = JSON.stringify(expenses);
    await AsyncStorage.setItem("@expenses", jsonValue);
  } catch (e) {
    console.error("Failed to save expenses", e);
  }
};

// Load expenses
const loadExpenses = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@expenses");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load expenses", e);
    return [];
  }
};
