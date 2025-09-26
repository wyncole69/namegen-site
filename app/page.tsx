"use client";
import { useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("Ready");

  async function testApi() {
    setMsg("Calling API…");
    try {
      const res = await fetch("/api/random-people", { cache: "no-store" });
      const data = await res.json();
      setMsg(`Got ${Array.isArray(data.names) ? data.names.length : 0} names`);
      console.log("Names:", data.names);
      alert(`Success! Received ${data.names.length} names.`);
    } catch (e) {
      console.error(e);
      setMsg("API error (see console)");
      alert("API error — check console");
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#111", color: "#fff" }}>
      <h1>Minimal Test Page</h1>
      <p>Status: {msg}</p>
      <button onClick={testApi} style={{ padding: "8px 14px", marginTop: 12 }}>
        Test API
      </button>
      <p style={{ marginTop: 16, opacity: 0.7 }}>
        If this page shows and the button works, your frontend + API are OK.
        Any “chrome-extension://…” errors are from browser extensions.
      </p>
    </main>
  );
}
