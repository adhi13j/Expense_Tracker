import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";

import { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

export default function HomeScreen({ navigation }) {
  const Spending = 320;
  const {expenses , dispatch} = useContext(ExpenseContext)
  
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
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  margin: 2,
                  marginBottom: 4,
                  borderRadius: 5,
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Analytics")}
          >
            <Ionicons name="analytics-sharp" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Settings")}
          >
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AddExpense")}
          >
            <FontAwesome6 name="add" size={24} color="black" />
          </TouchableOpacity>
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
    marginBottom: 40,
  },
  Spending_text: {
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row", // ← horizontal layout
    justifyContent: "space-evenly", // ← space buttons evenly
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F7F7F7ff",
    marginBottom:50
  },

  button: {
    backgroundColor: "rgb(92, 174, 255)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

/*
SCSS HEX 
$dodger-blue:rgb(92, 174, 255);
$davys-gray: #51514Fff;
$dutch-white: #EFE3BFff;
$dutch-white-black:rgb(221, 204, 154);
$tea-rose-red: #F8CECCff;
$pale-azure: #99DDFFff;
$seasalt: #F7F7F7ff;
$seasalt2:rgb(220, 220, 220);
*/
