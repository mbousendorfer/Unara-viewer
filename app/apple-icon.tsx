import { ImageResponse } from "next/og";

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
          background: "linear-gradient(180deg, #f6f3eb 0%, #e7efe1 100%)",
          color: "#334034",
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
