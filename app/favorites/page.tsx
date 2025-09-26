"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Fav = { id: string; name: string; created_at: string };

export default function FavoritesPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [items, setItems] = useState<Fav[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      if (data.user) loadFavs();
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
      if (session?.user) loadFavs();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadFavs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("favorites")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) alert(error.message);
    else setItems(data || []);
  }

  async function removeFav(id: string) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) alert(error.message);
    else setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (!email)
    return (
      <main style={{ padding: 24 }}>
        <h1>Favorites</h1>
        <p>Please log in to view your saved names.</p>
      </main>
    );

  return (
    <main style={{ padding: 24 }}>
      <h1>Favorites</h1>
      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p>No favorites yet.</p>}
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {items.map((f) => (
          <div key={f.id} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.06)", padding: 12, borderRadius: 8 }}>
            <span>{f.name}</span>
            <button onClick={() => removeFav(f.id)} style={{ padding: "6px 10px" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
