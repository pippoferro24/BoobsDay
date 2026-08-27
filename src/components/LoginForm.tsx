"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SITE_URL } from "@/lib/supabase/config";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage(`Link inviato a ${email}. Controlla la posta.`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <label htmlFor="email" className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@esempio.it"
        className="mt-2 w-full border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-marvel"
      />

      <button
        type="submit"
        disabled={status === "sending" || status === "sent"}
        className="skew-slab mt-5 w-full bg-marvel px-6 py-3 transition hover:bg-marvel-dark disabled:opacity-50"
      >
        <span className="font-display block text-base font-bold uppercase tracking-wider text-white">
          {status === "sending" ? "Invio..." : status === "sent" ? "Inviato" : "Mandami il link"}
        </span>
      </button>

      {message && (
        <p
          role="status"
          className={`mt-4 text-sm ${status === "error" ? "text-amber-300" : "text-white/60"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
