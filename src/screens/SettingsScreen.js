import React, { useState , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { ExpenseContext } from "../context/ExpenseContext";
import { HistoryContext } from "../context/HistoryContext";

export default function SettingsScreen({ navigation }) {
  
  const { expenses, dispatch } = useContext(ExpenseContext);
  const { dispatch: historyDispatch } = useContext(HistoryContext);
  
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("₹");
  const handleReset = () => {
    Alert.alert(
      "Reset All Data?",
      "This will delete all expenses. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@history"); // <-- clear local storage
              dispatch({ type: "Clear_All" }); // clear expenses in memory
              historyDispatch({ type: "clearAll" }); // clear history in memory
              Alert.alert("Data Reset", "All data has been cleared.");
            } catch (err) {
              console.error("Failed to reset storage:", err);
              Alert.alert("Error", "Failed to reset data.");
            }
          },
        },
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#ccc", true: "dodgerblue" }}
        />
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Currency</Text>
        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
          style={{ flex: 1 }}
        >
          <Picker.Item label="₹ Rupee" value="₹" />
          <Picker.Item label="$ Dollar" value="$" />
          <Picker.Item label="€ Euro" value="€" />
        </Picker>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ManageCategories")}
      >
        <Ionicons name="list" size={20} color="white" />
        <Text style={styles.buttonText}>Manage Categories</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.danger]}
        onPress={handleReset}
      >
        <Ionicons name="trash" size={20} color="white" />
        <Text style={styles.buttonText}>Reset All Data</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "dodgerblue",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  danger: {
    backgroundColor: "crimson",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});
