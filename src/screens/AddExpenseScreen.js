import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function AddExpenseScreen({ navigation }) {
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");

  const handleAddExpense = () => {
    if (!activity || !amount) {
      Alert.alert("Validation Error", "Activity and Amount are required");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      activity,
      category,
      price: `₹${amount}`,
    };

    console.log("Expense added:", newExpense);
    // You can pass this data via context, props, or storage

    navigation.goBack(); // Navigate back after adding
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Activity</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Coffee, Bus Ticket"
        value={activity}
        onChangeText={setActivity}
      />

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Utilities" value="Utilities" />
        <Picker.Item label="Entertainment" value="Entertainment" />
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 120"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Button title="Add Expense" onPress={handleAddExpense} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    backgroundColor: "white",
  },
  picker: {
    marginTop: 8,
    backgroundColor: "white",
  },
});
  