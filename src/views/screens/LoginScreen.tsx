import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton, Notice, s, Tag } from "../components/UI";
import { Input } from "../components/Details";

type Props = {
  onLogin: () => void;
  onRegister: () => void;
};

export function LoginScreen({ onLogin, onRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordRef = React.useRef<TextInput>(null);

  function submit() {
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    setError("");
    onLogin();
  }

  return (
    <SafeAreaView
      style={s.page}
      edges={["top", "right", "bottom", "left"]}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : Platform.OS === "android"
              ? "height"
              : undefined
        }
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 24 }}>
            <View style={{ gap: 12 }}>
              <Image
                source={require("../../../assets/logo-mark.png")}
                accessibilityRole="image"
                accessibilityLabel="ScanGuard logo"
                style={{ width: 74, height: 74 }}
              />
              <Tag label="SCANGUARD" />
              <Text accessibilityRole="header" style={s.title}>
                Welcome back.
              </Text>
              <Text style={s.body}>
                Sign in to manage your scans and privacy reports.
              </Text>
            </View>

            <View style={s.card}>
              <View style={{ gap: 8 }}>
                <Text style={s.label}>Email address</Text>
                <Input
                  label="Email address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="student@example.com"
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              <View style={{ gap: 8 }}>
                <Text style={s.label}>Password</Text>
                <Input
                  ref={passwordRef}
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={submit}
                />
              </View>
              {error !== "" && (
                <Notice title="Check your details" message={error} tone="error" />
              )}
              <AppButton
                title="Sign in"
                icon="log-in-outline"
                onPress={submit}
              />
            </View>

            <View
              style={[
                s.row,
                { justifyContent: "center", flexWrap: "wrap", rowGap: 0 },
              ]}
            >
              <Text style={s.body}>Don't have an account?</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create an account"
                hitSlop={4}
                onPress={onRegister}
                style={({ pressed }) => [
                  s.textLink,
                  pressed && { opacity: 0.65 },
                ]}
              >
                <Text style={s.textLinkText}>Create account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});

