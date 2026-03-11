export const themeColors = {
  light: {
    background: "#f4f1ea",
    backgroundSecondary: "#ebe6dc",
    surface: "rgba(255, 252, 247, 0.86)",
    surfaceElevated: "rgba(255, 255, 253, 0.94)",
    surfaceMuted: "rgba(116, 126, 111, 0.08)",
    border: "rgba(55, 64, 57, 0.12)",
    borderStrong: "rgba(55, 64, 57, 0.2)",
    textPrimary: "#24312a",
    textSecondary: "#506056",
    textMuted: "#718074",
    accent: "#738a74",
    accentStrong: "#55725f",
    success: "#5f8a66",
    warning: "#b88949",
    danger: "#b4625f",
  },
  dark: {
    background: "#121818",
    backgroundSecondary: "#192121",
    surface: "rgba(28, 35, 35, 0.88)",
    surfaceElevated: "rgba(36, 44, 44, 0.96)",
    surfaceMuted: "rgba(226, 234, 225, 0.08)",
    border: "rgba(229, 236, 228, 0.12)",
    borderStrong: "rgba(229, 236, 228, 0.2)",
    textPrimary: "#eef3ed",
    textSecondary: "#ccd6cc",
    textMuted: "#a4b2a6",
    accent: "#a9c6ab",
    accentStrong: "#c6dcc7",
    success: "#8fb494",
    warning: "#d5b17c",
    danger: "#de8c87",
  },
} as const;

export const chartColors = {
  feed: "#d6a74a",
  sleep: "#7da7d1",
  pump: "#c58d87",
  growth: "#7ead7f",
  routine: "#aa94c5",
  who: "#7ea2d3",
} as const;

export const spacingScale = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
} as const;

export const typographyScale = {
  displayLg: { fontSize: 48, lineHeight: 1.05, fontWeight: 600 },
  displayMd: { fontSize: 36, lineHeight: 1.1, fontWeight: 600 },
  titleLg: { fontSize: 30, lineHeight: 1.15, fontWeight: 600 },
  titleMd: { fontSize: 24, lineHeight: 1.2, fontWeight: 600 },
  titleSm: { fontSize: 18, lineHeight: 1.3, fontWeight: 600 },
  bodyLg: { fontSize: 17, lineHeight: 1.6, fontWeight: 500 },
  bodyMd: { fontSize: 15, lineHeight: 1.6, fontWeight: 500 },
  bodySm: { fontSize: 13, lineHeight: 1.5, fontWeight: 500 },
  caption: { fontSize: 12, lineHeight: 1.4, fontWeight: 600 },
} as const;
