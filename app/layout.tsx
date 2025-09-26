import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Name Generator",
  description: "Fast ideas for humans, brands, pets & characters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
