import { useEffect, useRef, useState } from "react";
// A short timer demonstrates loading and failure without calling an API.
export function useDemoRequest() {
  const [status, setStatus] = useState("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function run(onSuccess: () => void, fail = false) {
    if (timer.current) clearTimeout(timer.current);
    setStatus("loading");
    timer.current = setTimeout(() => {
      setStatus(fail ? "error" : "success");
      if (!fail) onSuccess();
    }, 800);
  }
  return { status, run };
}
