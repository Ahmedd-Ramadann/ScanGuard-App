import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { s } from "./UI";
import { colors as c } from "../theme/theme";
export type ScreenProps = { onBack: () => void; footer: React.ReactNode };
export function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.eyebrow}>{label.toUpperCase()}</Text>
      <Text selectable style={s.body}>
        {value}
      </Text>
    </View>
  );
}
type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  label?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: TextInputProps["autoCorrect"];
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  maxLength?: number;
  editable?: boolean;
};

export const Input = React.forwardRef<TextInput, InputProps>(function Input({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = true,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  autoFocus = false,
  maxLength,
  editable = true,
}, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      ref={ref}
      accessibilityLabel={label ?? placeholder}
      accessibilityState={{ disabled: !editable }}
      placeholder={placeholder}
      placeholderTextColor={c.subtle}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      autoComplete={autoComplete}
      textContentType={textContentType}
      multiline={multiline}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      autoFocus={autoFocus}
      maxLength={maxLength}
      editable={editable}
      selectionColor={c.accentSoft}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        styles.input,
        focused && styles.inputFocused,
        multiline && styles.inputMultiline,
        !editable && styles.inputDisabled,
      ]}
    />
  );
});
const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: c.text,
    fontSize: 15,
    lineHeight: 21,
  },
  inputFocused: {
    borderColor: c.accentSoft,
    backgroundColor: c.raised,
  },
  inputMultiline: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  inputDisabled: { opacity: 0.6 },
});
