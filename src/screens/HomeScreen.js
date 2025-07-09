import React from "react";
import { View, StyleSheet, Text, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native";
export default function HomeScreen({ navigation }) {
  const Spending = 320;
  const data = [
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
    {
      id: "6",
      activity: "Electricity Bill",
      category: "Utilities",
      price: "₹450",
    },
    {
      id: "7",
      activity: "Movie Ticket",
      category: "Entertainment",
      price: "₹300",
    },
    { id: "8", activity: "Fast Food", category: "Food", price: "₹220" },
    { id: "9", activity: "Gym Fee", category: "Health", price: "₹600" },
    {
      id: "10",
      activity: "Internet Bill",
      category: "Utilities",
      price: "₹799",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7ff" }}>
      <View style={{ flex: 1 }}>
        <View style={styles.Spending_box}>
          <Text style={styles.Spending_text}>
            Todays spending : {Spending} ₹
          </Text>
        </View>
        <View
          style={{
            flex: 3,
            padding: 5,
            marginHorizontal: 10,
            borderWidth: 1,
            borderColor: "black",
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  margin:2,
                  borderRadius:5,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "rgb(232, 232, 232)",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.activity}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Amount: {item.price}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Add Expense"
            onPress={() => navigation.navigate("AddExpense")}
          />
          <Button
            title="Analytics"
            onPress={() => navigation.navigate("Analytics")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Spending_box: {
    backgroundColor: "#EFE3BFff",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "rgb(221, 204, 154)",
    height: 50,
    width: 230,
    alignItems: "center",
    justifyContent: "center",
    margin: 60,
    marginBottom:40
  },
  Spending_text: {
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#F7F7F7ff",
  },
});

/*
SCSS HEX 
$dodger-blue: #3399FFff;
$davys-gray: #51514Fff;
$dutch-white: #EFE3BFff;
$dutch-white-black:rgb(221, 204, 154);
$tea-rose-red: #F8CECCff;
$pale-azure: #99DDFFff;
$seasalt: #F7F7F7ff;
$seasalt2:rgb(220, 220, 220);
*/
