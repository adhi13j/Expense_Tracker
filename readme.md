# Expense Tracker

A React Native app for tracking and visualizing your expenses with beautiful analytics.

## Features

- **Period Filters:** View expenses for Last 4, 7, 10, or 30 days. Select a custom reference day.
- **Tabs:**
  - **Contribution:** Stacked bar chart of daily spending by category.
  - **Trend:** Pie chart of category totals for the period.
  - **Details:** Expandable daily breakdown with category, activity, and amount.
- **Category Filter:** Toggle categories to include/exclude from analytics.
- **Responsive UI:** Works on Android and iOS.

## Screenshots

_(Add screenshots here if you have them)_

## Installation

1. Clone the repo:

   ```sh
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Install required packages:

   ```sh
   npm install react-native-chart-kit @react-native-community/datetimepicker @expo/vector-icons
   ```

4. Run the app:
   ```sh
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

## Project Structure

```
src/
  components/
  context/
  screens/
    AnalyticsScreen.js
  App.js
```

## Notes

- Expenses should be in the format:
  ```js
  [{ date: "YYYY-MM-DD", expenses: [{ id, activity, category, price }] }];
  ```
- Category colors are automatically assigned and reused if needed.
- The app uses INR (₹) as the currency by default.

## License

MIT

---

**Happy tracking!**
