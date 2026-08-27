"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={signOut}
      disabled={pending}
      className="font-display font-semibold uppercase tracking-wide text-white/50 hover:text-white disabled:opacity-50"
    >
      Esci
    </button>
  );
}
