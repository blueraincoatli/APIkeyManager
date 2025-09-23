export interface ProviderDef {
  id: string;
  label: string;
  aliases: string[];
}

export const PROVIDERS: ProviderDef[] = [
  { id: "openai", label: "OpenAI", aliases: ["openai", "gpt", "chatgpt"] },
  { id: "claude", label: "Claude", aliases: ["claude", "anthropic"] },
  {
    id: "gemini",
    label: "Google Gemini Pro",
    aliases: ["google", "gemini", "vertex", "gcp"],
  },
  {
    id: "stability",
    label: "Stability AI",
    aliases: ["stability", "stable", "sd", "stability ai"],
  },
  { id: "cohere", label: "Cohere", aliases: ["cohere"] },
  { id: "azure", label: "Azure", aliases: ["azure", "microsoft"] },
  { id: "aws", label: "AWS", aliases: ["aws", "amazon"] },
];

export function matchProvider(
  name?: string,
  platform?: string,
  tags?: string[],
  providerIdOrLabel?: string,
) {
  if (!providerIdOrLabel) return false;
  const needle = providerIdOrLabel.toLowerCase();
  const def = PROVIDERS.find(
    (p) =>
      p.id === needle ||
      p.label.toLowerCase() === needle ||
      p.aliases.includes(needle),
  );
  const aliases = new Set([
    needle,
    ...(def?.aliases || []),
    def?.label.toLowerCase() || "",
    def?.id || "",
  ]);
  const hay = [name || "", platform || "", ...(tags || [])]
    .join(" ")
    .toLowerCase();
  for (const a of aliases) {
    if (!a) continue;
    if (hay.includes(a)) return true;
  }
  return false;
}
