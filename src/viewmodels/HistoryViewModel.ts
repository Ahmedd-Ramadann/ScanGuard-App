import { useState } from "react";
import { useAnalysis } from "./AnalysisProvider";
export function useHistoryViewModel() {
  const { records } = useAnalysis();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const visible = records.filter(
    (scan) =>
      (filter === "all" || scan.kind === filter) &&
      (scan.title + scan.content).toLowerCase().includes(query.toLowerCase()),
  );
  return { visible, query, setQuery, filter, setFilter };
}
