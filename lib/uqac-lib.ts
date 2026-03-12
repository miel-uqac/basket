import { createClient } from "@supabase/supabase-js";

export function getClient() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "")
    return supabase
}

export async function getUser(client: any) {
    const user = await client.auth.getUser()
    if (user.data.user) {
        return user.data.user
    } else {
        return null
    }
}