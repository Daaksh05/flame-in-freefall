import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "linear-gradient(145deg, #FB923C 0%, #EA580C 55%, #9A3412 100%)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2.5c.6 2.4-.4 3.9-1.8 5.4-1.6 1.7-2.9 3.3-2.9 5.6a4.7 4.7 0 0 0 9.4 0c0-1.2-.4-2.1-1-3 .1 1.3-.4 2.2-1.1 2.8-.2-1.6-1-2.5-2-3.4-.7-.6-.9-1.5-.6-2.4.3.5.9.9 1.5 1 .2-2.3-.7-4.1-1.5-6Z"
            fill="#FDE68A"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
