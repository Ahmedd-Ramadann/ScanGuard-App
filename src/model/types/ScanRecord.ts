export type ScanKind = "url" | "text" | "barcode";

export interface ScanRecord {
  id: string;
  kind: ScanKind;
  title: string;
  content: string;
  format: string;
  scannedAt: string;
}

export type LoadState = "ready" | "loading" | "empty" | "error";
