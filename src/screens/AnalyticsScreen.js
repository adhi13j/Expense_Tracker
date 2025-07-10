import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { HistoryContext } from "../context/HistoryContext";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#f7f7f7",
  backgroundGradientTo: "#f7f7f7",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const chartTypes = ["Pie", "Bar", "Daily"];
const filters = ["All", "7 Days", "30 Days"];

export default function AnalyticsScreen() {
  const { history } = useContext(HistoryContext);
  const [activeChart, setActiveChart] = useState("Pie");
  const [activeFilter, setActiveFilter] = useState("All");

  const filterHistory = () => {
    if (activeFilter === "All") return history;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (activeFilter === "7 Days" ? 7 : 30));
    return history.filter((entry) => new Date(entry.date) >= cutoff);
  };

  const filtered = filterHistory();
  const categoryTotals = {};
  const dailyTotals = [];

  filtered.forEach((entry) => {
    let dailyTotal = 0;
    entry.expenses.forEach((exp) => {
      const amt = parseFloat(exp.price.replace("₹", "")) || 0;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amt;
      dailyTotal += amt;
    });
    dailyTotals.push({ date: entry.date, total: dailyTotal });
  });

  const pieData = Object.keys(categoryTotals).map((cat, idx) => ({
    name: cat,
    population: categoryTotals[cat],
    color: ["#FF6384", "#36A2EB", "#FFCE56", "#99DDFF", "#F8CECC", "#A1C181"][
      idx % 6
    ],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [{ data: Object.values(categoryTotals) }],
  };

  const renderChart = () => {
    switch (activeChart) {
      case "Pie":
        return pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.noData}>No Data</Text>
        );
      case "Bar":
        return barData.labels.length > 0 ? (
          <BarChart
            data={barData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        ) : (
          <Text style={styles.noData}>No Data</Text>
        );
      case "Daily":
        return dailyTotals.map((day) => (
          <Text key={day.date} style={styles.dailyItem}>
            {day.date}: ₹{day.total.toFixed(2)}
          </Text>
        ));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>

      <View style={styles.tabContainer}>
        {chartTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, activeChart === type && styles.activeTab]}
            onPress={() => setActiveChart(type)}
          >
            <Text style={styles.tabText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filter,
              activeFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>{renderChart()}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "dodgerblue",
  },
  tabText: {
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  filter: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  activeFilter: {
    backgroundColor: "dodgerblue",
    borderColor: "dodgerblue",
  },
  filterText: {
    color: "black",
  },
  dailyItem: {
    fontSize: 14,
    marginBottom: 6,
  },
  noData: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
});
