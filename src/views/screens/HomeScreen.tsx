import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ScanRecord, LoadState } from "../../model/types/ScanRecord";
import { useHomeViewModel } from "../../viewmodels/HomeViewModel";
import {
  AppButton,
  Choice,
  DemoControls,
  Header,
  Icon,
  Page,
  s,
  Tag,
} from "../components/UI";
import { colors as c } from "../theme/theme";

type Props = {
  onScan: () => void;
  onResult: (scan: ScanRecord) => void;
  footer: React.ReactNode;
  onBackup: () => void;
};

export function HomeScreen({ onScan, onResult, footer, onBackup }: Props) {
  const vm = useHomeViewModel();
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const controls = (
    <DemoControls>
      <Text style={s.label}>Recent scan list</Text>
      <View style={{ gap: 10 }}>
        {(["ready", "loading", "empty", "error"] as LoadState[]).map(
          (state) => (
            <Choice
              key={state}
              label={state[0].toUpperCase() + state.slice(1)}
              selected={vm.state === state}
              onPress={() => vm.changeState(state)}
            />
          ),
        )}
      </View>
      <Text style={s.small}>
        Sample data only. Scans are not stored between sessions.
      </Text>
    </DemoControls>
  );

  return (
    <Page
      footer={footer}
      header={
        <Header
          title="ScanGuard"
          subtitle="Scan before you open."
          right={controls}
        />
      }
    >
      <View style={{ gap: 14 }}>
        <View style={s.row}>
          <View style={h.dot} />
          <Text style={[s.eyebrow, { color: c.muted }]}>
            PRIVACY STARTS WITH A PREVIEW
          </Text>
        </View>
        <Text accessibilityRole="header" style={s.title}>
          Scan smart.{"\n"}Stay in control.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start scanning"
        accessibilityHint="Opens the sample code scanner."
        onPress={onScan}
        style={({ pressed }) => [
          h.hero,
          compact && h.heroCompact,
          pressed && { opacity: 0.9 },
        ]}
      >
        <View style={s.row}>
          <Text style={h.heroEyebrow}>YOUR NEXT SCAN</Text>
          <View style={{ flex: 1 }} />
          <Icon name="arrow-forward" color={c.accentDark} size={22} />
        </View>
        <View style={[s.row, { justifyContent: "space-between" }]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={[h.heroTitle, compact && h.heroTitleCompact]}>
              Point. Scan.{"\n"}Know more.
            </Text>
            <Text style={h.heroBody}>QR codes & barcodes</Text>
          </View>
          <View style={[h.qrArtwork, compact && h.qrArtworkCompact]}>
            <Icon
              name="qr-code-outline"
              size={compact ? 58 : 82}
              color={c.accentDark}
            />
          </View>
        </View>
        <View style={h.heroBottom}>
          <Icon name="scan-outline" color={c.accentDark} size={21} />
          <Text style={h.heroButton}>Start scanning</Text>
          <View style={{ flex: 1 }} />
          <Icon name="arrow-forward" color={c.accentDark} size={20} />
        </View>
      </Pressable>

      <View style={h.privacyRow}>
        <View style={h.privacyIcon}>
          <Icon name="eye-off-outline" size={21} color={c.accentSoft} />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text style={s.label}>You choose what opens</Text>
          <Text style={s.small}>Scanned links never open automatically.</Text>
        </View>
      </View>

      <View style={{ gap: 16 }}>
        <View style={s.row}>
          <Text
            accessibilityRole="header"
            style={[s.sectionTitle, { flex: 1 }]}
          >
            Recent scans
          </Text>
          <Tag label="SAMPLE DATA" />
        </View>
        {vm.state === "loading" && (
          <View
            accessibilityRole="progressbar"
            accessibilityState={{ busy: true }}
            accessibilityLiveRegion="polite"
            style={h.stateCard}
          >
            <ActivityIndicator color={c.accentSoft} />
            <Text style={s.body}>Loading recent scans</Text>
          </View>
        )}
        {vm.state === "empty" && (
          <View style={h.stateCard}>
            <Icon name="scan-outline" size={32} color={c.muted} />
            <Text style={s.label}>Your first scan starts here</Text>
            <Text style={[s.body, { textAlign: "center" }]}>
              Your recent scans will appear in this space.
            </Text>
            <AppButton title="Scan a code" onPress={onScan} />
          </View>
        )}
        {vm.state === "error" && (
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={h.stateCard}
          >
            <Icon name="alert-circle-outline" size={32} color={c.red} />
            <Text style={s.label}>Couldn't load recent scans</Text>
            <Text style={s.body}>Please try again.</Text>
            <AppButton title="Try again" onPress={vm.retry} secondary />
          </View>
        )}
        {vm.scans.length > 0 && (
          <View style={h.list}>
            {vm.scans.map((scan, i) => (
              <Pressable
                key={scan.id}
                onPress={() => onResult(scan)}
                accessibilityRole="button"
                accessibilityLabel={`View sample ${scan.kind}: ${scan.title}`}
                accessibilityHint="Opens the scan result preview."
                style={({ pressed }) => [
                  h.scanRow,
                  i < vm.scans.length - 1 && h.divider,
                  pressed && { backgroundColor: c.raised },
                ]}
              >
                <View style={h.scanIcon}>
                  <Icon
                    name={
                      scan.kind === "url"
                        ? "link-outline"
                        : scan.kind === "text"
                          ? "document-text-outline"
                          : "barcode-outline"
                    }
                    size={21}
                    color={c.accentSoft}
                  />
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  <Text numberOfLines={1} style={s.label}>
                    {scan.title}
                  </Text>
                  <Text style={s.small}>
                    {scan.kind === "url"
                      ? "Website link"
                      : scan.kind === "text"
                        ? "Plain text"
                        : "Product code"}{" "}
                     {scan.format}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={17} color={c.subtle} />
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <AppButton
        title="Backup & restore"
        secondary
        icon="cloud-outline"
        onPress={onBackup}
      />
    </Page>
  );
}

const h = StyleSheet.create({
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent },
  hero: { backgroundColor: c.accent, padding: 22, gap: 22, borderRadius: 26 },
  heroCompact: { padding: 18, gap: 18, borderRadius: 22 },
  heroEyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    color: "#F2CBD7",
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 29,
    lineHeight: 33,
    color: c.accentDark,
    fontWeight: "700",
    letterSpacing: -1,
  },
  heroTitleCompact: { fontSize: 25, lineHeight: 30 },
  heroBody: { color: "#F2CBD7", fontSize: 12 },
  qrArtwork: {
    transform: [{ rotate: "8deg" }],
    backgroundColor: "#BA5775",
    padding: 10,
    borderRadius: 18,
  },
  qrArtworkCompact: { padding: 7, borderRadius: 15 },
  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#CB718F",
    paddingTop: 16,
  },
  heroButton: { color: c.accentDark, fontSize: 15, fontWeight: "700" },
  privacyRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  privacyIcon: {
    backgroundColor: "#34212B",
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20,
    overflow: "hidden",
  },
  scanRow: { padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: c.border },
  scanIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: c.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  stateCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: c.border,
    borderRadius: 20,
    padding: 24,
    gap: 14,
    alignItems: "center",
  },
});

