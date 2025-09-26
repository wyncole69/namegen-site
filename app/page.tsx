import Image from "next/image";
"use client";

import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState<"Human" | "Brand" | "Pet" | "Character">("Human");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<string[]>([]);

  // For now, only Human uses the API. Others use tiny seed lists (MVP).
  const brandSeeds = ["Fluxora", "BrightNest", "NovaMint", "Kindora", "Verdiant"];
  const petSeeds = ["Milo", "Luna", "Buddy", "Bella", "Coco", "Rocky", "Daisy"];
  const characterSeeds = ["Aelric", "Mirella", "Torren", "Lyra", "Kael", "Seraphine"];

  async function handleGenerate() {
    setLoading(true);
    try {
      if (category === "Human") {
        const res = await fetch("/api/random-people");
        const data = await res.json();
        setNames(data.names || []);
      } else if (category === "Brand") {
        setNames(shuffle(applyKeywordHint(brandSeeds, keywords)).slice(0, 10));
      } else if (category === "Pet") {
        setNames(shuffle(applyKeywordHint(petSeeds, keywords)).slice(0, 10));
      } else {
        setNames(shuffle(applyKeywordHint(characterSeeds, keywords)).slice(0, 10));
      }
    } catch (e) {
      console.error(e);
      setNames([]);
      alert("Oops — couldn’t get names. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function applyKeywordHint(list: string[], kw: string) {
    if (!kw.trim()) return list;
    const k = kw.trim().toLowerCase();
    // super simple hinting: add the keyword to the start/end sometimes
    const extended = list.map(n => (Math.random() > 0.5 ? `${capitalize(k)} ${n}` : `${n} ${capitalize(k)}`));
    return [...list, ...extended];
  }

  function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function capitalize(s: string) {
    return s ? s[0].toUpperCase() + s.slice(1) : s;
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Couldn’t copy — try selecting and copying manually.");
    }
  }

  function openDotComSearch(name: string) {
    // Opens a registrar search for name.com – simple and free for now
    const q = encodeURIComponent(name.replace(/\s+/g, "") + ".com");
    window.open(`https://www.namecheap.com/domains/registration/results/?domain=${q}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold">Name Generator</h1>
        <p className="mt-2 text-white/70">
          Parents, writers, and founders — get ideas fast. Pick a category, add optional keywords, and hit Generate.
        </p>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            className="rounded-md bg-white/10 border border-white/20 px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option>Human</option>
            <option>Brand</option>
            <option>Pet</option>
            <option>Character</option>
          </select>

          <input
            className="rounded-md bg-white/10 border border-white/20 px-3 py-2"
            placeholder="Keywords (optional)… e.g., nature, bold"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-md bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition px-4 py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-8 space-y-3">
          {names.length === 0 && (
            <div className="text-white/60">No names yet. Click Generate 👆</div>
          )}

          {names.map((n) => {
            const clean = n.trim().replace(/\s+/g, " ");
            return (
              <div
                key={n + Math.random()}
                className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-4 py-3"
              >
                <span className="text-lg">{clean}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(clean)}
                    className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-1.5"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => openDotComSearch(clean)}
                    className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-1.5"
                  >
                    Check .com
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple footer */}
        <div className="mt-10 text-sm text-white/50">
          <a
            className="underline hover:text-white"
            href="https://stripe.com"
            target="_blank"
          >
            Go Premium (coming next)
          </a>
        </div>
      </div>
    </main>
  );
}
