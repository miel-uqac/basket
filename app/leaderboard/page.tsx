"use client";
import Leaderboard from "@/components/leaderboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, LoadingBox, UqacBox, Wrapper } from "@/components/uqac-utils";
import { useAuth } from "@/hooks/useAuth";
import { getClient, getUser } from "@/lib/uqac-lib";
import { ArrowBigLeft, Play, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
    const router = useRouter();
    const user = useAuth();
    const [loading, setLoading] = useState(false);
    
    return (
        <Wrapper className="flex-col">
            {(user && !loading) ? (
                <>
                <Leaderboard user={user.id} />
                
                <div className="flex mt-4 gap-4">
                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {setLoading(true); router.push("/account")}}>
                        <UserPen className="mr-1" />
                        Account
                    </Button>

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