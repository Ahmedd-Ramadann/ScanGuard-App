import React, { createContext, useContext } from "react";
import { useAnalysisViewModel } from "./AnalysisViewModel";

const AnalysisContext = createContext<ReturnType<
  typeof useAnalysisViewModel
> | null>(null);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const value = useAnalysisViewModel();
  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

// Consumers share the state owned by AnalysisProvider.
export function useAnalysis() {
  const value = useContext(AnalysisContext);
  if (!value)
    throw new Error("useAnalysis must be used inside AnalysisProvider");
  return value;
}
