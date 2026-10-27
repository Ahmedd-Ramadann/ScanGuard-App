import { useState } from "react";
import { ScanRecord } from "../model/types/ScanRecord";
import { sampleScans } from "../model/data/sampleScans";

export function useAnalysisViewModel() {
  const [currentScan, setCurrentScan] = useState<ScanRecord | null>(null);
  const [records, setRecords] = useState<ScanRecord[]>(sampleScans);
  const [backup, setBackup] = useState<ScanRecord[] | null>(null);
  const [backupDate, setBackupDate] = useState("");
  function saveScan(scan: ScanRecord) {
    setCurrentScan(scan);
    setRecords((previous) => [
      scan,
      ...previous.filter((item) => item.id !== scan.id),
    ]);
  }
  function deleteScan(id: string) {
    setRecords((previous) => previous.filter((item) => item.id !== id));
  }
  return {
    currentScan,
    setCurrentScan,
    records,
    setRecords,
    saveScan,
    deleteScan,
    backup,
    setBackup,
    backupDate,
    setBackupDate,
  };
}
