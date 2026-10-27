import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanRecord } from "../../model/types/ScanRecord";
import { useHistoryViewModel } from "../../viewmodels/HistoryViewModel";
import { Header, Choice, Icon, s } from "../components/UI";
import { Input, ScreenProps } from "../components/Details";
import { colors as c } from "../theme/theme";
export function HistoryScreen({
  onBack,
  footer,
  onSelect,
}: ScreenProps & { onSelect: (scan: ScanRecord) => void }) {
  const vm = useHistoryViewModel();
  return (
    <SafeAreaView
      style={s.page}
      edges={["top", "right", "bottom", "left"]}
    >
      <Header title="Scan history" onBack={onBack} />
      <View style={{ paddingHorizontal: 24, gap: 16, paddingBottom: 16 }}>
        <Input
          label="Search scan history"
          placeholder="Search scans"
          value={vm.query}
          onChangeText={vm.setQuery}
          autoCorrect={false}
          autoComplete="off"
          returnKeyType="search"
        />
        <View style={s.row}>
          {["all", "url", "text", "barcode"].map((filter) => (
            <Choice
              key={filter}
              label={
                filter === "all"
                  ? "All"
                  : filter === "url"
                    ? "Links"
                    : filter === "text"
                      ? "Text"
                      : "Codes"
              }
              selected={vm.filter === filter}
              onPress={() => vm.setFilter(filter)}
            />
          ))}
        </View>
        <Text accessibilityLiveRegion="polite" style={s.body}>
          {vm.visible.length} {vm.visible.length === 1 ? "scan" : "scans"}
        </Text>
      </View>
      <FlatList
        style={styles.list}
        data={vm.visible}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.listContent,
          vm.visible.length === 0 && styles.emptyListContent,
        ]}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={"Details: " + item.title}
            accessibilityHint="Opens this scan record."
            onPress={() => onSelect(item)}
            style={({ pressed }) => [
              s.card,
              styles.resultCard,
              pressed && styles.resultCardPressed,
            ]}
          >
            <View style={s.row}>
              <Icon
                name={
                  item.kind === "url"
                    ? "link-outline"
                    : item.kind === "text"
                      ? "document-text-outline"
                      : "barcode-outline"
                }
              />
              <Text numberOfLines={2} style={[s.label, styles.resultTitle]}>
                {item.title}
              </Text>
              <Icon name="chevron-forward" />
            </View>
            <Text numberOfLines={2} style={s.body}>
              {item.content}
            </Text>
            <Text style={s.small}>
              {item.format} · {new Date(item.scannedAt).toLocaleDateString()}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={[s.card, styles.emptyCard]}>
            <Icon name="search-outline" size={32} color={c.muted} />
            <Text style={s.sectionTitle}>No scans found</Text>
            <Text style={s.body}>
              Try another search or scan a sample code.
            </Text>
          </View>
        }
      />
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  emptyListContent: { flexGrow: 1, justifyContent: "center" },
  resultCard: { paddingVertical: 16 },
  resultCardPressed: { backgroundColor: c.raised },
  resultTitle: { flex: 1, minWidth: 0 },
  emptyCard: { alignItems: "center" },
});
