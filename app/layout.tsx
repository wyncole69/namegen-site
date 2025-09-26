<div style={{color:"#fff"}}>DEBUG HEADER</div>
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Name Generator",
  description: "Fast ideas for humans, brands, pets & characters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="mx-auto max-w-2xl flex items-center justify-between">
            <a href="/" className="font-semibold">NameGen</a>
            <div className="flex items-center gap-4">
              <a href="/favorites" className="hover:underline">Favorites</a>
              <AuthBar />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="mx-auto max-w-2xl">{children}</div>
      </body>
    </html>
  );
}


