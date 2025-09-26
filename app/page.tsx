// app/page.tsx
"use client";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <h1>It works 🎉</h1>
      <p>If you can see this, the layout is fixed.</p>
      <a href="/api/random-people" style={{ color: "#9cf" }}>
        Test API (should return JSON)
      </a>
    </main>
  );
}
