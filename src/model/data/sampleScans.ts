import { ScanKind, ScanRecord } from "../types/ScanRecord";

// Phase 1 fixtures only. Nothing is sent to a server or saved to a database.
export const sampleScans: ScanRecord[] = [
  {
    id: "demo-url",
    kind: "url",
    title: "example.com",
    format: "QR Code",
    content: "https://example.com/events?utm_source=campus&utm_medium=poster",
    scannedAt: "2026-10-24T10:30:00.000Z",
  },
  {
    id: "demo-text",
    kind: "text",
    title: "Campus study session",
    format: "QR Code",
    content: "Study session at the library. Room B12, Monday at 2:00 PM.",
    scannedAt: "2026-10-24T09:15:00.000Z",
  },
  {
    id: "demo-barcode",
    kind: "barcode",
    title: "Product barcode",
    format: "EAN-13",
    content: "5901234123457",
    scannedAt: "2026-10-23T16:45:00.000Z",
  },
];

export const sampleFor = (kind: ScanKind): ScanRecord =>
  sampleScans.find((scan) => scan.kind === kind)!;
