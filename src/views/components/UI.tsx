import React, { ComponentProps, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors as c } from "../theme/theme";

export type IconName = ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  size = 22,
  color = c.text,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

export function AppButton({
  title,
  onPress,
  secondary = false,
  loading = false,
  icon,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  loading?: boolean;
  icon?: IconName;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (disabled || loading) && { opacity: 0.6 },
        pressed && { opacity: 0.8 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? c.accent : c.accentDark} />
      ) : (
        icon && (
          <Icon
            name={icon}
            color={secondary ? c.text : c.accentDark}
            size={20}
          />
        )
      )}
      <Text style={[s.buttonText, secondary && { color: c.text }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  name,
  label,
  onPress,
  active = false,
  toggle = false,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  toggle?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={toggle ? "togglebutton" : "button"}
      accessibilityLabel={label}
      accessibilityState={toggle ? { checked: active } : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        s.iconButton,
        active && { backgroundColor: c.accent, borderColor: c.accent },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon name={name} color={active ? c.accentDark : c.text} />
    </Pressable>
  );
}

export function Tag({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "green" | "amber";
}) {
  const color =
    tone === "green" ? c.green : tone === "amber" ? c.amber : c.muted;
  return (
    <View style={[s.tag, { borderColor: `${color}45` }]}>
      <Text style={[s.tagText, { color }]}>{label}</Text>
    </View>
  );
}

export function Header({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={s.header}>
      {onBack && (
        <IconButton name="arrow-back" label="Go back" onPress={onBack} />
      )}
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Text accessibilityRole="header" style={s.headerTitle}>
          {title}
        </Text>
        {subtitle && <Text style={s.small}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

export function Page({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <SafeAreaView
      style={s.page}
      edges={["top", "right", "bottom", "left"]}
    >
      {header}
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        {children}
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

export function Notice({
  title,
  message,
  tone = "neutral",
}: {
  title: string;
  message: string;
  tone?: "neutral" | "amber" | "error";
}) {
  const color = tone === "error" ? c.red : tone === "amber" ? c.amber : c.accentSoft;
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole={tone === "error" ? "alert" : undefined}
      style={[s.notice, { borderColor: `${color}40` }]}
    >
      <Icon
        name={tone === "neutral" ? "shield-outline" : "alert-circle-outline"}
        color={color}
        size={22}
      />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={[s.label, { color }]}>{title}</Text>
        <Text style={s.body}>{message}</Text>
      </View>
    </View>
  );
}

export function DemoControls({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open prototype controls"
        accessibilityHint="Preview the different UI states."
        onPress={() => setVisible(true)}
        style={({ pressed }) => [s.demoButton, pressed && s.demoButtonPressed]}
      >
        <Icon name="options-outline" size={17} color={c.muted} />
        <Text style={s.demoText}>UI demo</Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView
          style={s.overlay}
          edges={["top", "right", "bottom", "left"]}
        >
          <View
            accessibilityViewIsModal
            onAccessibilityEscape={() => setVisible(false)}
            style={s.modal}
          >
            <View style={s.row}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text accessibilityRole="header" style={s.sectionTitle}>
                  Prototype controls
                </Text>
                <Text style={[s.small, { marginTop: 5 }]}>
                  Preview the different UI states.
                </Text>
              </View>
              <IconButton
                name="close"
                label="Close prototype controls"
                onPress={() => setVisible(false)}
              />
            </View>
            <ScrollView
              style={s.modalBody}
              contentContainerStyle={s.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
            <AppButton title="Done" onPress={() => setVisible(false)} />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

export function Choice({
  label,
  selected,
  onPress,
  disabled = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.choice,
        selected && s.selectedChoice,
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={[s.choiceText, selected && { color: c.text }]}>{label}</Text>
    </Pressable>
  );
}

export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.background },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 28,
    gap: 24,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    color: c.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  title: {
    color: c.text,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
    letterSpacing: -1.3,
  },
  sectionTitle: {
    color: c.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  label: { color: c.text, fontSize: 14, fontWeight: "600" },
  body: { color: c.muted, fontSize: 14, lineHeight: 21 },
  small: { color: c.muted, fontSize: 12, lineHeight: 18 },
  eyebrow: {
    color: c.subtle,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  card: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 22,
    padding: 20,
    gap: 16,
  },
  button: {
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: c.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  secondary: {
    backgroundColor: c.raised,
    borderWidth: 1,
    borderColor: c.border,
  },
  buttonText: {
    flexShrink: 1,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: c.accentDark,
  },
  iconButton: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  tagText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.7 },
  notice: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: c.surface,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  demoButton: {
    minHeight: 44,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    borderRadius: 12,
  },
  demoButtonPressed: { backgroundColor: c.raised },
  demoText: { color: c.muted, fontSize: 11, fontWeight: "600" },
  overlay: {
    flex: 1,
    backgroundColor: "#000000B8",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    padding: 22,
    borderRadius: 24,
    width: "100%",
    maxWidth: 410,
    maxHeight: "100%",
    gap: 18,
  },
  modalBody: { flexShrink: 1 },
  modalContent: { gap: 16, paddingBottom: 2 },
  choice: {
    minHeight: 44,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  selectedChoice: { backgroundColor: "#4A2030", borderColor: c.accentSoft },
  choiceText: {
    color: c.muted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  textLink: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  textLinkText: { color: c.accentSoft, fontSize: 14, fontWeight: "600" },
});
