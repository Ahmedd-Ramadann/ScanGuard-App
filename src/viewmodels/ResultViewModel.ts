import { useEffect, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { useAnalysis } from "./AnalysisProvider";

export function useResultViewModel() {
  const { currentScan } = useAnalysis();
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "error"
  >("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copyContent() {
    if (!currentScan || copyState === "copying") return;
    if (timer.current) clearTimeout(timer.current);
    setCopyState("copying");
    try {
      const success = await Clipboard.setStringAsync(currentScan.content);
      setCopyState(success ? "copied" : "error");
    } catch {
      setCopyState("error");
    }
    timer.current = setTimeout(() => setCopyState("idle"), 3000);
  }

  return { scan: currentScan, copyState, copyContent };
}
