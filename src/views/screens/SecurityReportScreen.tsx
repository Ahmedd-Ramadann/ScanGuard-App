import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAnalysis } from "../../viewmodels/AnalysisProvider";
import { useDemoRequest } from "../../viewmodels/DemoRequest";
import { inspectLink } from "../../model/services/TrackingCleaner";
import {
  Page,
  Header,
  Tag,
  Notice,
  AppButton,
  DemoControls,
  Choice,
  s,
} from "../components/UI";
import { Detail, ScreenProps } from "../components/Details";
export function SecurityReportScreen({
  onBack,
  footer,
  onClean,
}: ScreenProps & { onClean: () => void }) {
  const { currentScan } = useAnalysis();
  const link = inspectLink(currentScan?.content || "");
  const [verdict, setVerdict] = useState("No known threats reported");
  const request = useDemoRequest();
  const controls = (
    <DemoControls>
      <Text style={s.body}>
        These are sample outcomes, not a live security check.
      </Text>
      <Choice
        label="Threat example"
        selected={verdict === "Threat reported"}
        disabled={request.status === "loading"}
        onPress={() => setVerdict("Threat reported")}
      />
      <Choice
        label="No threat example"
        selected={verdict !== "Threat reported"}
        disabled={request.status === "loading"}
        onPress={() => setVerdict("No known threats reported")}
      />
      <AppButton
        title="Simulate check failure"
        loading={request.status === "loading"}
        onPress={() => request.run(() => {}, true)}
      />
    </DemoControls>
  );
  return (
    <Page
      header={
        <Header title="Security report" onBack={onBack} right={controls} />
      }
      footer={footer}
    >
      <Text accessibilityRole="header" style={s.title}>
        Look before{"\n"}you open.
      </Text>
      <Tag label="DEMO REPORT" tone="amber" />
      <Notice
        title={
          request.status === "loading"
            ? "Checking sample report…"
            : request.status === "error"
              ? "Online check unavailable"
              : verdict
        }
        tone={
          request.status === "error" || verdict === "Threat reported"
            ? "error"
            : "amber"
        }
        message={
          request.status === "loading"
            ? "Running a simulated check. No network request is being made."
            : "Sample result only. No Google Safe Browsing request has been made. This is not a guarantee of safety."
        }
      />
      <View style={s.card}>
        <Detail label="Domain" value={link.domain || "No URL selected"} />
        <Detail label="Protocol" value={link.protocol || "Unknown"} />
        <Detail
          label="Tracking parameters"
          value={String(link.removed.length)}
        />
        <Detail
          label="Connection"
          value={
            link.protocol === "https:"
              ? "HTTPS URL — does not prove the site is trustworthy"
              : "No HTTPS detected"
          }
        />
      </View>
      <AppButton
        title={
          request.status === "loading"
            ? "Checking sample…"
            : "Preview check again"
        }
        loading={request.status === "loading"}
        onPress={() =>
          request.run(() => setVerdict("No known threats reported"))
        }
      />
      <AppButton
        title="Review tracking parameters"
        secondary
        onPress={onClean}
        disabled={!link.valid}
      />
    </Page>
  );
}
