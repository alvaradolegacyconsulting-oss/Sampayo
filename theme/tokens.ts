export const theme = {
  color: {
    // Preflight 006 palette.
    navy: "#1B2A47",
    navyDeep: "#121D33",
    // Eyebrows and accents on light backgrounds only; it fails contrast on navy (lib/contrast.test.ts).
    copper: "#94582A",
    // On navy only.
    copperLight: "#E3B98E",
    paper: "#F6F4EF",
    // Supporting neutrals for body text, borders and photo stand-ins.
    stone: "#EAE6DD",
    line: "#DDD7CB",
    ink: "#1E2635",
    muted: "#4B5263",
    alert: "#A12B1F",
    white: "#FFFFFF",
  },
  // Loaded in theme/fonts.ts; next/font needs literal arguments, so keep the two in sync
  // (lib/tokens.test.ts checks it).
  font: {
    body: { family: "Archivo", weights: ["400", "500", "600", "700", "800"] },
  },
  // Feed Tailwind's rounded-sm (inputs), rounded-md (buttons) and rounded-lg (cards).
  radius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.625rem",
  },
} as const;

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/**
 * Set on <html> in the root layouts. app/globals.css maps each one into Tailwind's @theme,
 * so components use classes like bg-navy and text-copper, never hex values.
 * Built from `theme`, so adding a token here only needs its matching line in globals.css.
 */
export const themeCssVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(theme.color).map(([name, value]) => [`--theme-${kebab(name)}`, value])),
  ...Object.fromEntries(Object.entries(theme.radius).map(([name, value]) => [`--theme-radius-${name}`, value])),
};
