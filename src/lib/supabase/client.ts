import { createBrowserClient } from "@supabase/ssr";

console.log("Supabase client is being created");
const ENV_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

console.log("env vars", ENV_VARS);


export function createClient() {
  return createBrowserClient(
    ENV_VARS.NEXT_PUBLIC_SUPABASE_URL!,
    ENV_VARS.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
