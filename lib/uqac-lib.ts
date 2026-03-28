import { createClient } from "@supabase/supabase-js";

export function getClient() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "", {
        db: {
            schema: "basket"
        }
    })
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

export function checkQrData(data: string) {
    if (data.startsWith("https://miel-uqac.github.io/basket/game?token=")) {
        const token = data.split("token=")[1];
        return token
    }
    return "";
}

export function formatDate(text: string) {
    return new Date(text).toLocaleString("en-US", {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", hour12: false})
}
