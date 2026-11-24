import { ImageResponse } from "next/og";
import { hero, site } from "@/content";

export const alt = site.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SAGE = "#9BBF9B";
const CREAM = "#F4F1EA";
const TREE = "M32 4 L44 22 L39 22 L50 38 L44 38 L58 58 L38 58 L32 46 L26 58 L6 58 L20 38 L14 38 L25 22 L20 22 Z";

/** Try to load Inter Tight 800 for the image; fall back to the default font if offline. */
async function loadFont(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Inter+Tight:wght@800&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const [line1, line2] = hero.headline.split(". ").map((s, i, a) => (i < a.length - 1 ? s + "." : s));
  const sub = "Websites, SEO & lead systems for tree service companies";
  const font = await loadFont(`ARBOR LEADS${hero.headline}${sub}${site.domain}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#13201A",
          color: CREAM,
          padding: 72,
          fontFamily: font ? "Inter Tight" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="62" height="64" viewBox="6 4 52 54">
            <path d={TREE} fill={SAGE} />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>ARBOR LEADS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>
          <div>{line1}</div>
          <div style={{ color: SAGE }}>{line2}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#B9C2B6" }}>
          <div>{sub}</div>
          <div style={{ color: CREAM }}>{site.domain}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Inter Tight", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
