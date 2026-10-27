import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAnalysis } from "../../viewmodels/AnalysisProvider";
import { Page, Header, AppButton, Notice, Tag, s } from "../components/UI";
import { Detail, ScreenProps } from "../components/Details";
export function ScanDetailsScreen({
  onBack,
  footer,
  onReport,
}: ScreenProps & { onReport: () => void }) {
  const { currentScan: scan, deleteScan } = useAnalysis();
  const [confirm, setConfirm] = useState(false);
  return (
    <Page
      header={<Header title="Scan details" onBack={onBack} />}
      footer={footer}
    >
      <Tag label="SESSION RECORD" />
      <Text style={s.title}>{scan?.title || "No scan selected"}</Text>
      {scan && (
        <>
          <View style={s.card}>
            <Detail label="Content" value={scan.content} />
            <Detail label="Code format" value={scan.format} />
            <Detail
              label="Captured"
              value={new Date(scan.scannedAt).toLocaleString()}
            />
            <Detail
              label="Security status"
              value="Not checked — prototype data"
            />
          </View>
          {scan.kind === "url" && (
            <AppButton title="View security report" onPress={onReport} />
          )}
          {confirm ? (
            <View style={s.card}>
              <Text style={s.sectionTitle}>Delete this scan?</Text>
              <Text style={s.body}>
                This removes it from the current demo session.
              </Text>
              <AppButton
                title="Confirm delete"
                onPress={() => {
                  deleteScan(scan.id);
                  onBack();
                }}
              />
              <AppButton
                secondary
                title="Cancel"
                onPress={() => setConfirm(false)}
              />
            </View>
          ) : (
            <AppButton
              title="Delete scan"
              secondary
              onPress={() => setConfirm(true)}
            />
          )}
        </>
      )}
      <Notice
        title="Session storage"
        message="This prototype keeps records in memory. Reloading the app resets the sample data."
      />
    </Page>
  );
}
