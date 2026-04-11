// === useAuth ===
// Client hook to enforce authentication + optional admin check
// - redirects to /login if not authenticated
// - restricts /panel routes to admin only (via env var)
// - returns user object for easy access on any page (must be used instead of manually calling supabase)
// Returns:
// - current user object (or null while loading)
// Usage:
// const user = useAuth()

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClient, getUser } from "@/lib/uqac-lib";
import { usePathname } from "next/navigation";

export function useAuth() {
    const client = getClient();
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const u = await getUser(client);

            // not logged in → redirect
            if (!u) {
                router.push("/login");
                return;
            }

            // admin-only routes
            if (pathname.startsWith("/panel")) {
                if (u.id !== process.env.NEXT_PUBLIC_ADMIN) {
                    router.push("/login")
                    return
                }
            }
            setUser(u);
        };
        if (!user) checkUser();
    }, [user, router]);

    return user;
}