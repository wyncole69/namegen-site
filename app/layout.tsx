// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import AuthBar from "@/components/AuthBar";

export const metadata: Metadata = {
  title: "Name Generator",
  description: "Fast ideas for humans, brands, pets & characters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 900, margin: "0 auto" }}>
            <a href="/" style={{ fontWeight: 600 }}>NameGen</a>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="/favorites">Favorites</a>
              <AuthBar />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>{children}</div>
      </body>
    </html>
  );
}

