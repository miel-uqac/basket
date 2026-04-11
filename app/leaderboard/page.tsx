// === LeaderboardPage ===
// Page wrapper for leaderboard view
// - requires auth (via useAuth)
// - displays Leaderboard component
// - navigation to account or game (QR)

"use client";

import Leaderboard from "@/components/leaderboard";
import { Button, LoadingBox, Wrapper } from "@/components/uqac-utils";
import { useAuth } from "@/hooks/useAuth";
import { Play, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LeaderboardPage() {
    const router = useRouter();
    const user = useAuth();
    const [loading, setLoading] = useState(false);
    
    return (
        <Wrapper className="flex-col">
            {(user && !loading) ? (
                <>
                {/* leaderboard display */}
                <Leaderboard user={user.id} />
                
                <div className="flex mt-4 gap-4">
                    {/* go to account page */}
                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {setLoading(true); router.push("/account")}}>
                        <UserPen className="mr-1" />
                        Account
                    </Button>

                    {/* start game (QR page) */}
                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {setLoading(true); router.push("/qr")}}>
                        <Play className="mr-1" />
                        Start game
                    </Button>
                </div>
                </>
            ) : (
                <LoadingBox />
            )}
        </Wrapper>
    )
}