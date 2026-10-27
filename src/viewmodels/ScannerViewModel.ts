import { useEffect, useRef, useState } from "react";
import { ScanKind, ScanRecord } from "../model/types/ScanRecord";
import { sampleFor } from "../model/data/sampleScans";

export function useScannerViewModel(onResult: (scan: ScanRecord) => void) {
  const [kind, setKind] = useState<ScanKind>("url");
  const [state, setState] = useState<"ready" | "loading" | "error">("ready");
  const [torch, setTorch] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function scan(shouldFail = false) {
    if (state === "loading") return;
    setState("loading");
    timer.current = setTimeout(() => {
      if (shouldFail) {
        setState("error");
        return;
      }
      setState("ready");
      onResult({
        ...sampleFor(kind),
        id: `demo-${Date.now()}`,
        scannedAt: new Date().toISOString(),
      });
    }, 1100);
  }

  function selectKind(value: ScanKind) {
    if (state === "loading") return;
    setKind(value);
    setState("ready");
  }

  return {
    kind,
    state,
    selectKind,
    torch,
    toggleTorch: () => setTorch(!torch),
    scan,
  };
}
