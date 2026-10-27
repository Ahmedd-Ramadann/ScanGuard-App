import React from "react";
import { Text, View } from "react-native";
import { useQrViewModel } from "../../viewmodels/QrViewModel";
import { Page, Header, AppButton, Notice, s } from "../components/UI";
import { Input, ScreenProps } from "../components/Details";
import { colors as c } from "../theme/theme";
export function QrGeneratorScreen({ onBack, footer }: ScreenProps) {
  const vm = useQrViewModel();
  return (
    <Page
      header={<Header title="Create a QR code" onBack={onBack} />}
      footer={footer}
    >
      <Text accessibilityRole="header" style={s.title}>
        Your words.{"\n"}One little code.
      </Text>
      <Text style={s.body}>Turn a link or short message into a QR code.</Text>
      <Input
        label="QR code content"
        placeholder="Enter a link or text"
        value={vm.text}
        onChangeText={vm.changeText}
        autoCapitalize="sentences"
        multiline
      />
      <Text
        style={[s.small, vm.text.length > 300 && { color: c.red }]}
      >
        {vm.text.length}/300 characters
      </Text>
      {vm.error !== "" && (
        <Notice title="Check your input" message={vm.error} tone="error" />
      )}
      <AppButton title="Generate QR code" onPress={vm.generate} />
      {vm.matrix.length ? (
        <View style={s.card}>
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel="Generated QR code"
            accessibilityLiveRegion="polite"
            style={{
              backgroundColor: "#FFFFFF",
              padding: 24,
              alignSelf: "center",
            }}
          >
            {vm.matrix.map((row, i) => (
              <View key={i} style={{ flexDirection: "row" }}>
                {row.map((dark, j) => (
                  <View
                    key={j}
                    style={{
                      width: 180 / vm.matrix.length,
                      height: 180 / vm.matrix.length,
                      backgroundColor: dark ? "#000000" : "#FFFFFF",
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
          <Text style={s.small}>Generated on this device. No upload.</Text>
          <AppButton
            title="Preview sharing"
            secondary
            onPress={() => vm.setShared(true)}
          />
          {vm.shared && (
            <Notice
              title="Share preview"
              message="In the full app, this action will open the device share sheet for the QR image. Nothing was sent."
            />
          )}
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Your code will appear here</Text>
          <Text style={s.body}>Enter content above, then tap Generate.</Text>
        </View>
      )}
    </Page>
  );
}
