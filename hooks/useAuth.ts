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
            if (!u) {
                router.push("/login");
                return;
            }
            if (pathname.startsWith("/panel")) {
                if (u.userId !== process.env.NEXT_PUBLIC_ADMIN) {
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