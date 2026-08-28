import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "@/components/LoginForm";
import { SITE_NAME } from "@/lib/site";

export const metadata = { title: `Accedi o registrati — ${SITE_NAME}` };

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-4xl font-extrabold uppercase leading-none text-white">
        Accedi o registrati
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">
        Non serve un modulo di registrazione a parte: inserisci la tua email, ti mandiamo un
        link di accesso. Se è la prima volta ti creiamo l&apos;account al volo, altrimenti
        accedi a quello che hai già. Niente password da ricordare.
      </p>

      {isSupabaseConfigured ? (
        <LoginForm />
      ) : (
        <div className="mt-8 border-l-2 border-amber-400 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          <p className="font-semibold">Supabase non è ancora collegato.</p>
          <p className="mt-2 text-amber-200/80">
            Copia <code className="text-amber-100">.env.local.example</code> in{" "}
            <code className="text-amber-100">.env.local</code>, incolla URL e anon key del
            progetto e riavvia <code className="text-amber-100">npm run dev</code>. Nel
            frattempo puoi votare in modalità demo: i voti restano nel tuo browser.
          </p>
        </div>
      )}
    </main>
  );
}
