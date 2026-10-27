import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScanKind, ScanRecord } from "../../model/types/ScanRecord";
import { useScannerViewModel } from "../../viewmodels/ScannerViewModel";
import {
  AppButton,
  Choice,
  DemoControls,
  Header,
  Icon,
  IconButton,
  Notice,
  Page,
  s,
  Tag,
} from "../components/UI";
import { colors as c } from "../theme/theme";

type Props = {
  onBack: () => void;
  onResult: (scan: ScanRecord) => void;
  footer: React.ReactNode;
};

export function ScannerScreen({ onBack, onResult, footer }: Props) {
  const vm = useScannerViewModel(onResult);
  const controls = (
    <DemoControls>
      <Text style={s.body}>
        This screen uses sample codes. Camera access and live decoding will be
        added in a later phase.
      </Text>
      <AppButton
        title="Simulate scan error"
        secondary
        loading={vm.state === "loading"}
        onPress={() => vm.scan(true)}
      />
      <Text style={s.small}>
        Close this panel to see the error message and retry.
      </Text>
    </DemoControls>
  );

  return (
    <Page
      footer={footer}
      header={
        <Header
          title="Scan a code"
          onBack={onBack}
          right={controls}
        />
      }
    >
      <View style={{ gap: 8 }}>
        <Text
          accessibilityRole="header"
          style={[s.title, { fontSize: 30, lineHeight: 36 }]}
        >
          What’s behind the code?
        </Text>
        <Text style={s.body}>
          Put a QR code or barcode inside the frame.
        </Text>
      </View>

      <View style={[a.viewfinder, vm.torch && { backgroundColor: "#3F2932" }]}>
        <View style={a.cameraTop}>
          <Tag label="CAMERA PREVIEW" />
          <View style={{ flex: 1 }} />
          <Icon name="ellipse" size={7} color={c.accent} />
        </View>
        <View
          style={a.target}
          accessible
          accessibilityLabel={`Simulated camera viewfinder showing a sample ${vm.kind === "barcode" ? "barcode" : "QR code"}${vm.state === "loading" ? ", reading code" : ""}`}
          accessibilityState={{ busy: vm.state === "loading" }}
          accessibilityLiveRegion="polite"
        >
          <View style={[a.corner, a.topLeft]} />
          <View style={[a.corner, a.topRight]} />
          <View style={[a.corner, a.bottomLeft]} />
          <View style={[a.corner, a.bottomRight]} />
          <View style={a.artwork}>
            <Icon
              name={
                vm.kind === "barcode" ? "barcode-outline" : "qr-code-outline"
              }
              size={124}
              color={c.accentSoft}
            />
          </View>
          <View style={a.scanLine} />
          {vm.state === "loading" && (
            <View style={a.scanOverlay}>
              <ActivityIndicator size="large" color={c.accentSoft} />
            </View>
          )}
        </View>
        <View style={a.cameraBottom}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={a.cameraLabel}>
              {vm.state === "loading"
                ? "Reading sample code…"
                : "Keep the code inside the frame"}
            </Text>
            {vm.torch && (
              <Text style={a.cameraCaption}>Flashlight preview on</Text>
            )}
          </View>
          <IconButton
            name={vm.torch ? "flash" : "flash-outline"}
            label={`${vm.torch ? "Turn off" : "Turn on"} flashlight preview`}
            active={vm.torch}
            toggle
            onPress={vm.toggleTorch}
          />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <View style={s.row}>
          <Text style={[s.eyebrow, { flex: 1 }]}>CHOOSE A SAMPLE</Text>
          <Text style={s.small}>UI prototype</Text>
        </View>
        <View style={s.row}>
          {(["url", "text", "barcode"] as ScanKind[]).map((kind) => (
            <Choice
              key={kind}
              label={
                kind === "url"
                  ? "Website"
                  : kind === "text"
                    ? "Text"
                    : "Barcode"
              }
              selected={vm.kind === kind}
              disabled={vm.state === "loading"}
              onPress={() => vm.selectKind(kind)}
            />
          ))}
        </View>
        <AppButton
          title={
            vm.state === "loading"
              ? "Reading code…"
              : vm.state === "error"
                ? "Try scanning again"
                : "Scan sample code"
          }
          loading={vm.state === "loading"}
          onPress={() => vm.scan()}
          icon="scan-outline"
        />
      </View>

      {vm.state === "error" ? (
        <Notice
          tone="error"
          title="We couldn’t read that code"
          message="Keep the code inside the frame and try scanning again."
        />
      ) : (
        <Notice
          title="Your next step is your choice"
          message="We’ll show you the content first. Nothing opens automatically."
        />
      )}
    </Page>
  );
}

const a = StyleSheet.create({
  viewfinder: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 26,
    backgroundColor: "#21131A",
    padding: 18,
    gap: 26,
    overflow: "hidden",
  },
  cameraTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  target: {
    width: "80%",
    maxWidth: 250,
    aspectRatio: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    width: 34,
    height: 34,
    borderColor: c.accentSoft,
  },
  topLeft: {
    left: 0,
    top: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 13,
  },
  topRight: {
    right: 0,
    top: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 13,
  },
  bottomLeft: {
    left: 0,
    bottom: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 13,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 13,
  },
  artwork: { opacity: 0.6, transform: [{ rotate: "-6deg" }] },
  scanLine: {
    position: "absolute",
    left: 10,
    right: 10,
    top: "50%",
    height: 2,
    backgroundColor: c.accentSoft,
    opacity: 0.8,
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#21131AC0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  cameraBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  cameraLabel: {
    color: c.text,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  cameraCaption: { color: c.muted, fontSize: 10, lineHeight: 16, marginTop: 3 },
});
