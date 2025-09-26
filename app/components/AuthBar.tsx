"use client";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function AuthBar() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function sendMagicLink() {
    const addr = prompt("Enter your email to sign in:");
    if (!addr) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: addr,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Check your email to log in!");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {email ? (
        <>
          <span className="opacity-70">Signed in as <b>{email}</b></span>
          <button onClick={signOut} className="bg-white/10 px-3 py-1 rounded hover:bg-white/20">
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={sendMagicLink}
          className="bg-white/10 px-3 py-1 rounded hover:bg-white/20"
          disabled={loading}
        >
          {loading ? "Sending…" : "Login / Sign up"}
        </button>
      )}
    </div>
  );
}

Add AuthBar component
