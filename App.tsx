import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnalysisProvider } from "./src/viewmodels/AnalysisProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.outer}>
        <View style={styles.app}>
          <StatusBar style="light" />
          <AnalysisProvider>
            <AppNavigator />
          </AnalysisProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#080607", alignItems: "center" },
  app: { flex: 1, width: "100%", maxWidth: 480, backgroundColor: "#0D0B0C" },
});
