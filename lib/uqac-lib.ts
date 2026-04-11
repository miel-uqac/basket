// === getClient ===
// Creates and returns a Supabase client
// - uses public env vars
// - forces "basket" schema
// Usage:
// const client = getClient()
import { createClient } from "@supabase/supabase-js";

export function getClient() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "", {
        db: {
            schema: "basket"
        }
    })
    return supabase
}

// === getUser ===
// Fetches current authenticated user from Supabase
// Returns:
// - user object if logged in
// - null otherwise
// Usage:
// const user = await getUser(client)
export async function getUser(client: any) {
    const user = await client.auth.getUser()
    if (user.data.user) {
        return user.data.user
    } else {
        return null
    }
}

// === checkQrData ===
// Validates QR string and extracts token
// - expects specific URL format
// Returns:
// - token string if valid
// - "" otherwise
// Usage:
// const token = checkQrData(scannedText)
export function checkQrData(data: string) {
    if (data.startsWith("https://miel-uqac.github.io/basket/game?token=")) {
        const token = data.split("token=")[1];
        return token
    }
    return "";
}

// === formatDate ===
// Formats a date string to readable US format
// - includes date + time (24h)
// Usage:
// formatDate("2024-01-01T12:00:00Z")
export function formatDate(text: string) {
    return new Date(text).toLocaleString("en-US", {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", hour12: false})
}
