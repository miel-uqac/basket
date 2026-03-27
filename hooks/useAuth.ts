import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClient, getUser } from "@/lib/uqac-lib";

export function useAuth() {
    const client = getClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const u = await getUser(client);
            if (!u) router.push("/login");
            setUser(u);
        };
        if (!user) checkUser();
    }, [user, router]);

    return user;
}