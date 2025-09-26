"use client";

import { useState } from "react";

type Category = "Human" | "Brand" | "Pet" | "Character";

export default function Home() {
  const [category, setCategory] = useState<Category>("Human");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const brandSeeds = ["Fluxora", "BrightNest", "NovaMint", "Kindora", "Verdiant"];
  const petSeeds = ["Milo", "Luna", "Buddy", "Bella", "Coco", "Rocky", "Daisy"];
  const characterSeeds = ["Aelric", "Mirella", "Torren", "Lyra", "Kael", "Seraphine"];

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      if (category === "Human") {
        const res = await fetch("/api/random-people", { cache: "no-store" });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        setNames(Array.isArray(data.names) ? data.names : []);
      } else if (category === "Brand") {
        setNames(pickTen(applyKeywordHint(brandSeeds, keywords)));
      } else if (category === "Pet") {
        setNames(pickTen(applyKeywordHint(petSeeds, keywords)));
      } else {
        setNames(pickTen(applyKeywordHint(characterSeeds, keywords)));
      }
    } catch (e) {
      console.error(e);
      setNames([]);
      setError("Couldn’t get names. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function pickTen(list: string[]) { return shuffle(list).slice(0, 10); }
  function applyKeywordHint(list: string[], kw: string) {
    if (!kw.trim()) return list;
    const k = kw.trim();
    const extended = list.map(n => (Math.random() > 0.5 ? `${capitalize(k)} ${n}` : `${n} ${capitalize(k)}`));
    return [...list, ...extended];
  }
  function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }
  function capitalize(s: string) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

  async function copyToClipboard(text: string) {
    try { await navigator.clipboard.writeText(text); alert("Copied!"); }
    catch { alert("Couldn’t copy — copy manually."); }
  }
  function openDotComSearch(name: string) {
    const q = encodeURIComponent(name.replace(/\s+/g, "") + ".com");
    window.open(`https://www.namecheap.com/domains/registration/results/?domain=${q}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold">Name Generator</h1>
        <p className="mt-2 text-white/70">Pick a category, add optional keywords, and hit Generate.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            className="rounded-md bg-white/10 border border-white/20 px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="Human">Human</option>
            <option value="Brand">Brand</option>
            <option value="Pet">Pet</option>
            <option value="Character">Character</option>
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

        {error && <div className="mt-4 rounded-md bg-red-500/20 border border-red-400/40 px-3 py-2 text-red-100">{error}</div>}

        <div className="mt-8 space-y-3">
          {names.length === 0 && !error && <div className="text-white/60">No names yet. Click Generate 👆</div>}

          {names.map((n, i) => {
            const clean = n.trim().replace(/\s+/g, " ");
            return (
              <div key={`${clean}-${i}`} className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-4 py-3">
                <span className="text-lg">{clean}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(clean)} className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-1.5">Copy</button>
                  <button onClick={() => openDotComSearch(clean)} className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-1.5">Check .com</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
