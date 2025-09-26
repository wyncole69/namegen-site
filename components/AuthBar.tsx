"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";   // ← relative import

export default function AuthBar() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setEmail(session?.user?.email ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function sendMagicLink() {
    const addr = prompt("Enter your email to sign in:");
    if (!addr) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: addr,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Check your email for the login link!");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {email ? (
        <>
          <span className="opacity-70">Signed in as <b>{email}</b></span>
          <button onClick={signOut} className="rounded bg-white/10 px-3 py-1 hover:bg-white/20">
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={sendMagicLink}
          disabled={loading}
          className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
        >
          {loading ? "Sending…" : "Login / Sign up"}
        </button>
      )}
    </div>
  );
}

