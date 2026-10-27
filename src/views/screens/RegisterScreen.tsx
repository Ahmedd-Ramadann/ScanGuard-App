import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton, Header, Notice, s } from "../components/UI";
import { Input } from "../components/Details";

type Props = {
  onBack: () => void;
  onRegister: () => void;
};

export function RegisterScreen({ onBack, onRegister }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  function submit() {
    if (name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setError("");
    onRegister();
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
        style={{ flex: 1 }}
      >
        <Header title="Create account" onBack={onBack} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 4,
            paddingBottom: 28,
            gap: 22,
          }}
        >
          <View style={{ gap: 8 }}>
            <Text accessibilityRole="header" style={s.title}>
              Start scanning safely.
            </Text>
          </View>

          <View style={s.card}>
            <View style={{ gap: 8 }}>
              <Text style={s.label}>Full name</Text>
              <Input
                label="Full name"
                value={name}
                onChangeText={setName}
                placeholder="Ahmed Ramadan"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={s.label}>Email address</Text>
              <Input
                ref={emailRef}
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
                placeholder="At least 6 characters"
                secureTextEntry
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={s.label}>Confirm password</Text>
              <Input
                ref={confirmPasswordRef}
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter the password again"
                secureTextEntry
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="go"
                onSubmitEditing={submit}
              />
            </View>
            {error !== "" && (
              <Notice title="Check your details" message={error} tone="error" />
            )}
            <AppButton title="Create account" onPress={submit} />
          </View>

          <View
            style={[
              s.row,
              { justifyContent: "center", flexWrap: "wrap", rowGap: 0 },
            ]}
          >
            <Text style={s.body}>Already have an account?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              hitSlop={4}
              onPress={onBack}
              style={({ pressed }) => [
                s.textLink,
                pressed && { opacity: 0.65 },
              ]}
            >
              <Text style={s.textLinkText}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
