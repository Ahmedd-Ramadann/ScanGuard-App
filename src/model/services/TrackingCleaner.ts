// Only known tracking parameters are removed. Other parameters are preserved.
export function inspectLink(content: string) {
  try {
    const url = new URL(content);
    const removed = Array.from(url.searchParams.keys()).filter(
      (key) =>
        key.toLowerCase().startsWith("utm_") ||
        ["fbclid", "gclid"].includes(key.toLowerCase()),
    );
    removed.forEach((key) => url.searchParams.delete(key));
    return {
      valid: true,
      domain: url.hostname,
      protocol: url.protocol,
      removed,
      cleaned: url.toString(),
    };
  } catch {
    return {
      valid: false,
      domain: "",
      protocol: "",
      removed: [],
      cleaned: content,
    };
  }
}
