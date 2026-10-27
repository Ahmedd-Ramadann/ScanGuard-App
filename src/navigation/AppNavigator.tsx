import React, { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { useAnalysis } from "../viewmodels/AnalysisProvider";
import { ScanRecord } from "../model/types/ScanRecord";
import { HomeScreen } from "../views/screens/HomeScreen";
import { ScannerScreen } from "../views/screens/ScannerScreen";
import { ScanResultScreen } from "../views/screens/ScanResultScreen";
import { SecurityReportScreen } from "../views/screens/SecurityReportScreen";
import { CleanLinkScreen } from "../views/screens/CleanLinkScreen";
import { HistoryScreen } from "../views/screens/HistoryScreen";
import { ScanDetailsScreen } from "../views/screens/ScanDetailsScreen";
import { QrGeneratorScreen } from "../views/screens/QrGeneratorScreen";
import { BackupRestoreScreen } from "../views/screens/BackupRestoreScreen";
import { LoginScreen } from "../views/screens/LoginScreen";
import { RegisterScreen } from "../views/screens/RegisterScreen";
import { Icon, IconName } from "../views/components/UI";
import { colors as c } from "../views/theme/theme";
type Route =
  | "login"
  | "register"
  | "home"
  | "scanner"
  | "result"
  | "report"
  | "clean"
  | "history"
  | "details"
  | "create"
  | "backup";
export function AppNavigator() {
  const [stack, setStack] = useState<Route[]>(["login"]);
  const route = stack[stack.length - 1];
  const data = useAnalysis();
  function go(next: Route) {
    setStack((previous) => [...previous, next]);
  }
  function back() {
    setStack((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : ["home"],
    );
  }
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (stack.length === 1 && route === "home") return false;
      back();
      return true;
    });
    return () => sub.remove();
  }, [stack]);
  function result(scan: ScanRecord, save = false) {
    if (save) data.saveScan(scan);
    else data.setCurrentScan(scan);
    go("result");
  }
  if (route === "login")
    return (
      <LoginScreen
        onLogin={() => setStack(["home"])}
        onRegister={() => setStack(["register"])}
      />
    );
  if (route === "register")
    return (
      <RegisterScreen
        onBack={() => setStack(["login"])}
        onRegister={() => setStack(["home"])}
      />
    );
  const tabs: { route: Route; title: string; icon: IconName }[] = [
    { route: "home", title: "Home", icon: "home-outline" },
    { route: "scanner", title: "Scan", icon: "scan-outline" },
    { route: "history", title: "History", icon: "time-outline" },
    { route: "create", title: "Create", icon: "qr-code-outline" },
  ];
  const footer = (
    <View accessibilityRole="tablist" style={styles.bar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.route}
          accessibilityRole="tab"
          accessibilityLabel={tab.title}
          accessibilityHint={`Switches to the ${tab.title} screen.`}
          accessibilityState={{ selected: route === tab.route }}
          onPress={() => setStack([tab.route])}
          style={({ pressed }) => [
            styles.tab,
            pressed && styles.tabPressed,
          ]}
        >
          <Icon
            name={tab.icon}
            color={route === tab.route ? c.accentSoft : c.muted}
          />
          <Text
            style={{
              color: route === tab.route ? c.accentSoft : c.muted,
              fontSize: 11,
            }}
          >
            {tab.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
  const props = { footer, onBack: back };
  if (route === "scanner")
    return <ScannerScreen {...props} onResult={(scan) => result(scan, true)} />;
  if (route === "result")
    return (
      <ScanResultScreen
        {...props}
        onScan={() => go("scanner")}
        onReport={() => go("report")}
      />
    );
  if (route === "report")
    return <SecurityReportScreen {...props} onClean={() => go("clean")} />;
  if (route === "clean") return <CleanLinkScreen {...props} />;
  if (route === "history")
    return (
      <HistoryScreen
        {...props}
        onSelect={(scan) => {
          data.setCurrentScan(scan);
          go("details");
        }}
      />
    );
  if (route === "details")
    return <ScanDetailsScreen {...props} onReport={() => go("report")} />;
  if (route === "create") return <QrGeneratorScreen {...props} />;
  if (route === "backup") return <BackupRestoreScreen {...props} />;
  return (
    <HomeScreen
      footer={footer}
      onScan={() => go("scanner")}
      onResult={(scan) => result(scan)}
      onBackup={() => go("backup")}
    />
  );
}
const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: c.border,
    backgroundColor: c.background,
    paddingVertical: 12,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 12,
  },
  tabPressed: { backgroundColor: c.raised },
});
