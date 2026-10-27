import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useResultViewModel } from "../../viewmodels/ResultViewModel";
import {
  AppButton,
  Header,
  Icon,
  Notice,
  Page,
  s,
  Tag,
} from "../components/UI";
import { colors as c } from "../theme/theme";

type Props = {
  onBack: () => void;
  onScan: () => void;
  footer: React.ReactNode;
  onReport: () => void;
};

export function ScanResultScreen({ onBack, onScan, footer, onReport }: Props) {
  const vm = useResultViewModel();
  const scan = vm.scan;
  const header = (
    <Header
      title="Scan result"
      subtitle="Take a look before you continue"
      onBack={onBack}
      right={<Tag label="DEMO" />}
    />
  );
  if (!scan)
    return (
      <Page footer={footer} header={header}>
        <Notice
          title="No scan selected"
          message="Scan a sample code to preview its content here."
        />
        <AppButton title="Go to scanner" onPress={onScan} />
      </Page>
    );

  const isUrl = scan.kind === "url";
  const kindLabel = isUrl
    ? "WEBSITE LINK"
    : scan.kind === "text"
      ? "PLAIN TEXT"
      : "PRODUCT BARCODE";
  return (
    <Page footer={footer} header={header}>
      <View style={r.intro}>
        <View style={r.successIcon}>
          <Icon name="checkmark" size={32} color={c.accentSoft} />
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <Text accessibilityRole="header" style={r.title}>
            Code captured.
          </Text>
          <Text style={s.body}>Here’s what we found inside.</Text>
        </View>
      </View>

      <View style={s.card}>
        <View style={s.row}>
          <View style={r.typeIcon}>
            <Icon
              name={
                isUrl
                  ? "link-outline"
                  : scan.kind === "text"
                    ? "document-text-outline"
                    : "barcode-outline"
              }
              size={23}
              color={c.accentSoft}
            />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={s.eyebrow}>{kindLabel}</Text>
            <Text style={s.sectionTitle}>{scan.title}</Text>
          </View>
        </View>
        <View style={r.contentBox}>
          <Text selectable style={r.content}>
            {scan.content}
          </Text>
        </View>
        <View style={r.metadata}>
            <Text style={[s.small, r.metaLabel]}>Code format</Text>
          <Text style={r.metaValue}>{scan.format}</Text>
        </View>
        <View style={r.metadata}>
            <Text style={[s.small, r.metaLabel]}>Content type</Text>
          <Text style={r.metaValue}>
            {isUrl ? "URL" : scan.kind === "text" ? "Text" : "Barcode"}
          </Text>
        </View>
        <View style={r.metadata}>
            <Text style={[s.small, r.metaLabel]}>Source</Text>
          <Text style={r.metaValue}>Prototype sample</Text>
        </View>
      </View>

      {isUrl ? (
        <View style={s.card}>
          <View style={{ gap: 12 }}>
            <View style={s.row}>
              <Icon name="shield-outline" size={22} color={c.accentSoft} />
              <Text style={s.sectionTitle}>Before you open</Text>
            </View>
            <Tag label="NOT CHECKED" tone="amber" />
          </View>
          <Text style={s.body}>
            This link hasn’t been checked for threats. Capturing a code does not
            mean its content is safe.
          </Text>
          <AppButton
            title="View security report"
            onPress={onReport}
            secondary
          />
        </View>
      ) : (
        <Notice
          title={
            scan.kind === "text"
              ? "Text content detected"
              : "Barcode value detected"
          }
          message={
            scan.kind === "text"
              ? "This code contains plain text. You can select or copy the content below."
              : "This preview shows the barcode number only. No product lookup has been performed."
          }
        />
      )}

      <View style={{ gap: 12 }}>
        <AppButton
          title={
            vm.copyState === "copied"
              ? "Copied to clipboard"
              : vm.copyState === "copying"
                ? "Copying…"
                : vm.copyState === "error"
                  ? "Try copying again"
                  : isUrl
                    ? "Copy link"
                    : "Copy content"
          }
          onPress={vm.copyContent}
          loading={vm.copyState === "copying"}
          icon={
            vm.copyState === "copied" ? "checkmark-outline" : "copy-outline"
          }
        />
        {vm.copyState === "error" && (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={{ color: c.red, fontSize: 12 }}
          >
            Couldn’t access the clipboard. You can select the content and copy
            it manually.
          </Text>
        )}
        {vm.copyState === "copied" && (
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: c.green, fontSize: 12, textAlign: "center" }}
          >
            Content copied successfully.
          </Text>
        )}
        <AppButton
          title="Scan another code"
          onPress={onScan}
          secondary
          icon="scan-outline"
        />
      </View>
      <View
        style={[
          s.row,
          { justifyContent: "center", flexWrap: "wrap", rowGap: 4 },
        ]}
      >
        <Icon name="lock-closed-outline" size={13} color={c.subtle} />
        <Text style={s.small}>No links opened. No data uploaded.</Text>
      </View>
    </Page>
  );
}

const r = StyleSheet.create({
  intro: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 21,
    backgroundColor: "#4A2030",
    borderWidth: 1,
    borderColor: "#754052",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: c.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: c.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  contentBox: {
    padding: 16,
    backgroundColor: c.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  content: {
    color: "#F1D7DF",
    fontSize: 14,
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  metadata: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  metaLabel: { flex: 1 },
  metaValue: {
    maxWidth: "60%",
    flexShrink: 1,
    color: c.text,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    textAlign: "right",
  },
});
