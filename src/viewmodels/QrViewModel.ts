import { useState } from "react";
import qrcode from "qrcode-generator";
export function useQrViewModel() {
  const [text, setText] = useState("");
  const [matrix, setMatrix] = useState<boolean[][]>([]);
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);
  function changeText(value: string) {
    setText(value);
    setMatrix([]);
    setError("");
    setShared(false);
  }
  function generate() {
    if (!text.trim()) {
      setError("Enter a link or text first.");
      return;
    }
    if (text.trim().length > 300) {
      setError("Use 300 characters or fewer for this preview.");
      return;
    }
    try {
      // Convert Unicode text to UTF-8 bytes for the QR library.
      qrcode.stringToBytes = (value: string) => {
        const encoded = encodeURIComponent(value);
        const bytes: number[] = [];
        for (let i = 0; i < encoded.length; i++) {
          if (encoded[i] === "%") { bytes.push(parseInt(encoded.slice(i + 1, i + 3), 16)); i += 2; }
          else bytes.push(encoded.charCodeAt(i));
        }
        return bytes;
      };
    const code = qrcode(0, "M");
      code.addData(text.trim());
      code.make();
      const rows = [];
      for (let row = 0; row < code.getModuleCount(); row++) {
        const cells = [];
        for (let col = 0; col < code.getModuleCount(); col++)
          cells.push(code.isDark(row, col));
        rows.push(cells);
      }
      setMatrix(rows);
      setError("");
      setShared(false);
    } catch {
      setError("Unable to generate this code. Try shorter text.");
    }
  }
  return { text, changeText, matrix, error, generate, shared, setShared };
}
