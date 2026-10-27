import { useEffect, useRef, useState } from "react";
import { useAnalysis } from "./AnalysisProvider";
import { LoadState } from "../model/types/ScanRecord";

export function useHomeViewModel() {
  const { records } = useAnalysis();
  const [state, setState] = useState<LoadState>("ready");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function changeState(next: LoadState) {
    if (timer.current) clearTimeout(timer.current);
    setState(next);
  }

  function retry() {
    changeState("loading");
    timer.current = setTimeout(() => setState("ready"), 800);
  }

  return {
    state,
    changeState,
    retry,
    scans: state === "ready" ? records.slice(0, 3) : [],
  };
}
