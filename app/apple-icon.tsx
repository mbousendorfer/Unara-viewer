import { ImageResponse } from "next/og";

import { themeColors } from "@/design-system/tokens";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(180deg, ${themeColors.light.background} 0%, ${themeColors.light.accent} 100%)`,
          color: themeColors.light.textPrimary,
          fontSize: 84,
          fontWeight: 700,
          borderRadius: 36,
        }}
      >
        N
      </div>
    ),
    size,
  );
}
