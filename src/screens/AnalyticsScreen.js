import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { HistoryContext } from "../context/HistoryContext";
import { PieChart, StackedBarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const periods = [
  { label: "Last 4 Days", days: 4 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 10 Days", days: 10 },
  { label: "Last 30 Days", days: 30 },
];
const tabs = ["Contribution", "Trend", "Details"];

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#99DDFF",
  "#F8CECC",
  "#A1C181",
  "#B39DDB",
  "#FFB74D",
];

function formatCurrency(n) {
  return "₹" + n.toFixed(2);
}

export default function AnalyticsScreen() {
  const { history } = useContext(HistoryContext);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [customToday, setCustomToday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});
  const [activeCategories, setActiveCategories] = useState(new Set());

  // Date range filter
  const filterHistory = useCallback(() => {
    const end = new Date(customToday);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(end.getDate() - (selectedPeriod.days - 1));
    return history.filter((entry) => {
      const d = new Date(entry.date);
      return d >= start && d <= end;
    });
  }, [history, selectedPeriod, customToday]);

  const filtered = filterHistory();

  // Compute category totals and daily totals
  const categoryTotals = {};
  const dailyTotals = [];
  filtered.forEach((entry) => {
    let daySum = 0;
    entry.expenses.forEach((exp) => {
      const amt = parseFloat(exp.price.replace("₹", "")) || 0;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amt;
      daySum += amt;
    });
    dailyTotals.push({ date: entry.date, total: daySum });
  });

  // Prepare data for stacked contribution chart (one bar per day, stacked by category)
  const categories = Object.keys(categoryTotals);

  // Sync activeCategories with categories
  React.useEffect(() => {
    setActiveCategories((prev) => {
      if (!prev || prev.size === 0) return new Set(categories);
      const newSet = new Set([...prev].filter((cat) => categories.includes(cat)));
      categories.forEach((cat) => newSet.add(cat));
      return newSet;
    });
  }, [categories.join(",")]);

  // Filtered categories for all visualizations
  const filteredCategories = categories.filter((cat) => activeCategories.has(cat));

  // Filter data by active categories
  const filteredStackedData = dailyTotals.map((d) => {
    const entry = filtered.find((e) => e.date === d.date);
    return filteredCategories.map((cat) => {
      if (!entry) return 0;
      return entry.expenses
        .filter((exp) => exp.category === cat)
        .reduce((sum, exp) => sum + (parseFloat(exp.price.replace("₹", "")) || 0), 0);
    });
  });
  const filteredPieData = filteredCategories.map((cat, idx) => ({
    name: cat,
    population: categoryTotals[cat],
    color: colors[categories.indexOf(cat) % colors.length],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));
  const filteredStackedBarData = {
    labels: dailyTotals.map((d) => d.date.slice(5)),
    legend: filteredCategories,
    data: filteredStackedData,
    barColors: filteredCategories.map((cat) => colors[categories.indexOf(cat) % colors.length]),
  };

  // Averages
  const totalSpend = dailyTotals.reduce((sum, d) => sum + d.total, 0);
  const avgPerDay = dailyTotals.length ? totalSpend / dailyTotals.length : 0;
  const avgPerCategory = filteredCategories.length
    ? totalSpend / filteredCategories.length
    : 0;

  // Legend
  const renderLegend = () => (
    <View style={styles.legendRow}>
      {filteredPieData.map((item, idx) => (
        <View key={item.name} style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: item.color }]}
          />
          <Text style={styles.legendText}>{item.name}</Text>
        </View>
      ))}
    </View>
  );

  // Category filter chips
  const renderCategoryChips = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical: 8, marginLeft: 8}}>
      {categories.map((cat, idx) => {
        const active = activeCategories.has(cat);
        return (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              { backgroundColor: active ? colors[idx % colors.length] : "#eee" },
            ]}
            onPress={() => {
              setActiveCategories((prev) => {
                const next = new Set(prev);
                if (next.has(cat)) next.delete(cat);
                else next.add(cat);
                return next;
              });
            }}
          >
            <Text style={{ color: active ? "#fff" : "#888", fontWeight: "bold" }}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // Details tab with two-column layout
  const renderDetailsTab = () => {
    // Sort dailyTotals by date ascending
    const sorted = [...dailyTotals].sort((a, b) => a.date.localeCompare(b.date));
    if (!sorted.length) return <Text style={styles.noData}>No data</Text>;

    return (
      <View>
        {sorted.map((d, i) => {
          const prev = sorted[i - 1];
          let change = null;
          if (prev && prev.total > 0) {
            change = (((d.total - prev.total) / prev.total) * 100).toFixed(1);
          }
          const isExpanded = expandedDays[d.date];
          const entry = filtered.find((e) => e.date === d.date);
          const expenses = entry
            ? entry.expenses.filter((exp) => activeCategories.has(exp.category))
            : [];
          const isToday =
            d.date === customToday.toISOString().slice(0, 10);

          return (
            <View
              key={d.date}
              style={[
                styles.detailRowContainer,
                isExpanded && styles.detailRowContainerExpanded,
              ]}
            >
              {/* Left column: date, total, change, expand */}
              <TouchableOpacity
                onPress={() =>
                  setExpandedDays((prev) => ({
                    ...prev,
                    [d.date]: !prev[d.date],
                  }))
                }
                style={[
                  styles.detailLeftCol,
                  isToday && { borderColor: "#00acc1", borderWidth: 1.5 },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayDate, isToday && { color: "#00acc1" }]}>
                  {new Date(d.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    weekday: "short",
                  })}
                </Text>
                <Text style={styles.dayTotal}>{formatCurrency(d.total)}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  {i === 0 ? (
                    <Text style={styles.dayChangeNoPrev}>No prev</Text>
                  ) : (
                    <>
                      <AntDesign
                        name={
                          change > 0
                            ? "arrowup"
                            : change < 0
                            ? "arrowdown"
                            : "minus"
                        }
                        size={14}
                        color={
                          change > 0
                            ? "#e53935"
                            : change < 0
                            ? "#43a047"
                            : "#888"
                        }
                      />
                      <Text
                        style={{
                          color:
                            change > 0
                              ? "#e53935"
                              : change < 0
                              ? "#43a047"
                              : "#888",
                          marginLeft: 2,
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        {change !== null ? `${Math.abs(change)}%` : ""}
                      </Text>
                    </>
                  )}
                  <AntDesign
                    name={isExpanded ? "right" : "left"}
                    size={16}
                    color="#888"
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </TouchableOpacity>
              {/* Right column: expanded expenses */}
              {isExpanded && (
                <View style={styles.detailRightCol}>
                  {expenses.length === 0 ? (
                    <Text style={{ color: "#aaa", fontSize: 13, marginLeft: 8 }}>
                      No expenses
                    </Text>
                  ) : (
                    expenses.map((exp, idx) => (
                      <View
                        key={exp.id || idx}
                        style={[
                          styles.expenseRow,
                          idx === expenses.length - 1 && { borderBottomWidth: 0 },
                        ]}
                      >
                        <View
                          style={[
                            styles.categoryChip,
                            {
                              backgroundColor:
                                colors[categories.indexOf(exp.category) % colors.length],
                            },
                          ]}
                        >
                          <Text style={styles.categoryChipText}>{exp.category}</Text>
                        </View>
                        <Text style={styles.expenseActivity} numberOfLines={1}>
                          {exp.activity}
                        </Text>
                        <Text style={styles.expenseAmount}>{exp.price}</Text>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          );
        })}
        <Text style={styles.avgText}>
          Total: {formatCurrency(totalSpend)}
        </Text>
      </View>
    );
  };

  // Tab content
  const renderTab = () => {
    switch (activeTab) {
      case "Contribution":
        return filteredCategories.length && filteredStackedData.length ? (
          <View>
            <StackedBarChart
              data={filteredStackedBarData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={{ marginVertical: 8 }}
              hideLegend
            />
            {renderLegend()}
            <Text style={styles.avgText}>
              Avg per category: {formatCurrency(avgPerCategory)}
            </Text>
          </View>
        ) : (
          <Text style={styles.noData}>No data</Text>
        );

      case "Trend":
        return filteredCategories.length ? (
          <View>
            <PieChart
              data={filteredPieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            {renderLegend()}
            <Text style={styles.avgText}>
              Total: {formatCurrency(totalSpend)}
            </Text>
          </View>
        ) : (
          <Text style={styles.noData}>No data</Text>
        );

      case "Details":
        return renderDetailsTab();

      default:
        return null;
    }
  };

  // Date picker handler
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setCustomToday(selectedDate);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 130 }}
    >
      <Text style={styles.title}>Analytics</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Period</Text>
        <View style={styles.periodContainer}>
          {periods.map((p) => (
            <TouchableOpacity
              key={p.label}
              style={[
                styles.periodButton,
                selectedPeriod.label === p.label && styles.activePeriod,
              ]}
              onPress={() => setSelectedPeriod(p)}
            >
              <Text style={styles.periodText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category filter chips */}
      {categories.length > 0 && renderCategoryChips()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>View</Text>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartWrapper}>{renderTab()}</View>

      {/* Date selector at the bottom */}
      <View style={styles.bottomDateSelector}>
        <Text style={styles.bottomDateLabel}>Reference Day:</Text>
        <TouchableOpacity
          style={styles.bottomDateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.bottomDateText}>
            {customToday.toISOString().slice(0, 10)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={customToday}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", margin: 16, textAlign: "center" },
  section: { marginHorizontal: 16, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  periodContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  periodButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 4,
    backgroundColor: "#f7f7f7",
  },
  activePeriod: { backgroundColor: "#e0f7fa", borderColor: "#00acc1" },
  periodText: { fontSize: 12 },
  todayButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#00acc1",
    borderRadius: 4,
    backgroundColor: "#e0f7fa",
    marginLeft: 4,
  },
  todayText: { fontSize: 12, color: "#00acc1" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    paddingVertical: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderColor: "transparent",
    minWidth: 100,
    alignItems: "center",
  },
  activeTab: { borderColor: "#00acc1" },
  tabText: { fontSize: 15, fontWeight: "bold" },
  chartWrapper: { alignItems: "center", marginTop: 20 },
  noData: { textAlign: "center", color: "#999", marginTop: 20 },
  detailItem: { fontSize: 14, marginVertical: 4, marginLeft: 16 },
  avgText: { fontSize: 13, color: "#666", marginTop: 10, textAlign: "center" },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    marginVertical: 2,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 4,
  },
  legendText: { fontSize: 12 },
  bottomDateSelector: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#e0f7fa",
    paddingVertical: 18,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#00acc1",
  },
  bottomDateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007c91",
    marginBottom: 6,
  },
  bottomDateButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#00acc1",
    borderRadius: 8,
    marginTop: 2,
  },
  bottomDateText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  // Details tab two-column layout
  detailRowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    marginHorizontal: 0,
    width: "100%",
  },
  detailRowContainerExpanded: {
    // Optionally, add a background or border when expanded
  },
  detailLeftCol: {
    width: 140,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 10,
    marginLeft: 8,
    marginRight: 8,
    alignItems: "flex-start",
    justifyContent: "center",
    elevation: 1,
    borderColor: "#eee",
    borderWidth: 1,
  },
  detailRightCol: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
    minWidth: 0,
    elevation: 1,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  dayDate: { fontWeight: "bold", fontSize: 15 },
  dayTotal: { fontWeight: "bold", fontSize: 15, marginTop: 4, color: "#222" },
  dayChangeNoPrev: { color: "#bbb", fontSize: 12, fontStyle: "italic", marginTop: 4 },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 48,
    alignItems: "center",
  },
  categoryChipText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  expenseActivity: { flex: 1, color: "#333", fontSize: 13 },
  expenseAmount: { fontWeight: "bold", color: "#222", fontSize: 13, minWidth: 60, textAlign: "right" },
});
