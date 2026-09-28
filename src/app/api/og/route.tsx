import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { MARK } from "@/components/brand/Logo";

// Brand fonts and the arch photograph are read once. URLs relative to this
// file are traced into the deployment bundle.
const [caslon, caslonItalic, hanken600, arch] = await Promise.all([
  readFile(new URL("../../../assets/fonts/CaslonDisplay-400.woff", import.meta.url)),
  readFile(new URL("../../../assets/fonts/CaslonText-Italic.woff", import.meta.url)),
  readFile(new URL("../../../assets/fonts/Hanken-600.woff", import.meta.url)),
  readFile(new URL("../../../assets/og-arch.jpg", import.meta.url)),
]);
const archSrc = `data:image/jpeg;base64,${arch.toString("base64")}`;

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=… */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Quiet counsel for life's defining chapters.").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Family · Estate · Business Law").slice(0, 60);
  const size = title.length > 70 ? 54 : title.length > 42 ? 66 : 80;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#0f2a22", color: "#f3eee3", fontFamily: "Hanken" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "64px 56px 60px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="52" height="52" viewBox="0 0 48 48">
              <path d={MARK.v1} fill="#f3eee3" />
              <path d={MARK.v2} fill="#b08d57" />
              <path d={MARK.rule} fill="#f3eee3" opacity="0.55" />
            </svg>
            <div style={{ display: "flex", alignItems: "center", fontSize: 20, letterSpacing: 6, fontWeight: 600 }}>
              WHITCOMBE
              <span style={{ fontFamily: "CaslonItalic", fontSize: 28, color: "#b08d57", letterSpacing: 0, margin: "0 10px" }}>&amp;</span>
              VALE
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ display: "flex", fontSize: 19, letterSpacing: 5, textTransform: "uppercase", color: "#cdb083", fontWeight: 600 }}>{eyebrow}</div>
            <div style={{ display: "flex", fontFamily: "Caslon", fontSize: size, lineHeight: 1.02, letterSpacing: -1, maxWidth: 700 }}>{title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 17, letterSpacing: 4, color: "rgba(243,238,227,.7)", fontWeight: 600 }}>
            <div style={{ width: 48, height: 1, backgroundColor: "#b08d57" }} />
            ATTORNEYS · DALLAS, TEXAS · EST. 2009
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", paddingRight: 72, paddingTop: 70 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img> */}
          <img src={archSrc} width={340} height={560} alt="" style={{ objectFit: "cover", borderTopLeftRadius: 170, borderTopRightRadius: 170 }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Caslon", data: caslon, weight: 400, style: "normal" },
        { name: "CaslonItalic", data: caslonItalic, weight: 400, style: "italic" },
        { name: "Hanken", data: hanken600, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
