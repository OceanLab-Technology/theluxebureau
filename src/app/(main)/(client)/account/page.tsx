import { createClient } from "@/lib/supabase/server"
import AccountPage from "./AccountPage"

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountPage user={user} />
}