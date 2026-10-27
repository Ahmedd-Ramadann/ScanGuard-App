import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAnalysis } from "../../viewmodels/AnalysisProvider";
import { useDemoRequest } from "../../viewmodels/DemoRequest";
import {
  Page,
  Header,
  AppButton,
  Notice,
  DemoControls,
  s,
  Icon,
  Tag,
} from "../components/UI";
import { Detail, ScreenProps } from "../components/Details";
export function BackupRestoreScreen({ onBack, footer }: ScreenProps) {
  const data = useAnalysis();
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const request = useDemoRequest();
  const busy = request.status === "loading";
  function backup() {
    request.run(() => {
      data.setBackup([...data.records]);
      data.setBackupDate(new Date().toLocaleString());
      setMessage("Demo backup created in memory.");
    });
  }
  function restore() {
    request.run(() => {
      if (data.backup) data.setRecords([...data.backup]);
      setMessage("Demo records restored.");
      setConfirm(false);
    });
  }
  return (
    <Page
      header={
        <Header
          title="Backup & restore"
          onBack={onBack}
          right={
            <DemoControls>
              <AppButton
                title="Simulate backup error"
                onPress={() => request.run(() => {}, true)}
              />
              <Text style={s.body}>No Google account or network is used.</Text>
            </DemoControls>
          }
        />
      }
      footer={footer}
    >
      <Text style={s.title}>Keep a copy.{"\n"}Keep control.</Text>
      <Tag label="GOOGLE DRIVE · UI DEMO" />
      <View style={s.card}>
        <Icon name="cloud-outline" size={38} />
        <Text style={s.sectionTitle}>
          {connected ? "Demo connection ready" : "Connect to Google Drive"}
        </Text>
        <Text style={s.body}>Try the connection flow without signing in.</Text>
        <AppButton
          title={connected ? "Disconnect demo" : "Connect demo account"}
          secondary
          disabled={busy}
          onPress={() => {
            setConnected(!connected);
            setConfirm(false);
            setMessage("");
          }}
        />
      </View>
      <View style={s.card}>
        <Detail label="Current records" value={String(data.records.length)} />
        <Detail
          label="Last demo backup"
          value={data.backupDate || "No backup yet"}
        />
        <Detail
          label="Backup records"
          value={data.backup ? String(data.backup.length) : "None"}
        />
      </View>
      <AppButton
        title={busy ? "Working…" : "Create demo backup"}
        loading={busy}
        disabled={!connected}
        onPress={backup}
      />
      <AppButton
        title="Restore demo backup"
        secondary
        disabled={!connected || !data.backup || busy}
        onPress={() => setConfirm(true)}
      />
      {confirm && (
        <View style={s.card}>
          <Text style={s.label}>Replace the current session records?</Text>
          <AppButton
            title="Confirm restore"
            disabled={busy}
            onPress={restore}
          />
          <AppButton
            secondary
            title="Cancel restore"
            disabled={busy}
            onPress={() => setConfirm(false)}
          />
        </View>
      )}
      {request.status === "error" && (
        <Notice
          tone="error"
          title="Backup action failed"
          message="This is a simulated error. Retry using the backup or restore button."
        />
      )}
      {request.status === "success" && message !== "" && (
        <Notice title="Demo completed" message={message} />
      )}
      <Text style={s.small}>
        All backup data stays in memory and resets on reload. No files are
        uploaded to Google Drive.
      </Text>
    </Page>
  );
}
