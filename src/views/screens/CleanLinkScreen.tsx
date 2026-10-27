import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAnalysis } from "../../viewmodels/AnalysisProvider";
import { inspectLink } from "../../model/services/TrackingCleaner";
import { Page, Header, Notice, AppButton, Tag, s } from "../components/UI";
import { Detail, ScreenProps } from "../components/Details";
export function CleanLinkScreen({ onBack, footer }: ScreenProps) {
  const { currentScan } = useAnalysis();
  const link = inspectLink(currentScan?.content || "");
  const [cleaned, setCleaned] = useState(false);
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      const ok = await Clipboard.setStringAsync(link.cleaned);
      setMessage(
        ok
          ? "Cleaned link copied."
          : "Could not copy. Select the link manually.",
      );
    } catch {
      setMessage("Could not copy. Select the link manually.");
    }
  }
  return (
    <Page
      header={<Header title="Clean link" onBack={onBack} />}
      footer={footer}
    >
      <Text style={s.title}>Less tracking.{"\n"}Same destination.</Text>
      <Text style={s.body}>
        Review the known tracking parameters before removing them.
      </Text>
      <View style={s.card}>
        <Detail
          label="Original link"
          value={currentScan?.content || "No URL selected"}
        />
      </View>
      <View style={s.card}>
        <Text style={s.sectionTitle}>Detected parameters</Text>
        {link.removed.length ? (
          link.removed.map((name) => (
            <Tag key={name} label={name} tone="amber" />
          ))
        ) : (
          <Text style={s.body}>No known tracking parameters found.</Text>
        )}
      </View>
      <AppButton
        title={
          cleaned ? "Tracking parameters removed" : "Remove tracking parameters"
        }
        disabled={cleaned || !link.valid || !link.removed.length}
        onPress={() => setCleaned(true)}
      />
      {(cleaned || !link.removed.length) && link.valid && (
        <View style={s.card}>
          <Detail label="Cleaned link" value={link.cleaned} />
          <AppButton title="Copy cleaned link" onPress={copy} />
        </View>
      )}
      {message !== "" && (
        <Text accessibilityLiveRegion="polite" style={s.body}>
          {message}
        </Text>
      )}
      <Notice
        title="Cleaning is not a security check"
        message="Removing tracking parameters does not make a malicious link safe. Some websites may behave differently without these parameters."
        tone="amber"
      />
    </Page>
  );
}
