// === GamePage ===
// Game session page
// - accessed via QR token (?token=...)
// - validates game existence in DB
// - locks player into game (single player control)
// - fetches user score
// - listens to realtime updates on "game" table
// - allows leaving game (clears player field)
// Usage:
// /game?token=XYZ

"use client";

import { Button, LoadingBox, Wrapper } from "@/components/uqac-utils";
import UserStats from "@/components/user-stats";
import { useAuth } from "@/hooks/useAuth";
import { getClient } from "@/lib/uqac-lib";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GamePage() {
    const client = getClient()
    const router = useRouter();
    const user = useAuth();
    const [token, setToken] = useState("")
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [gameReady, setGameReady] = useState(false);

    // read token from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const gameToken = params.get("token") || "";

        if (!gameToken) {
            router.push("/qr");
        } else {
            setToken(gameToken);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (loading) {
                return;
            }

            // check game exists
            const gameExists: any = await client.from("game").select("player").eq("id", token);

            if (gameExists.data.length == 0) {
                setGameReady(false);
                alert("Game not found !");
                router.push("/qr");
                client.removeChannel(channel)
                return;
            }

            // handle player lock (only one active player)
            if (gameExists.data[0].player) {
                console.log("player exists");
                if (gameExists.data[0].player != user.id) {
                    setGameReady(false);
                    alert("Someone else is playing !");
                    router.push("/qr");
                    client.removeChannel(channel)
                    return;
                }
            } else {
                console.log("update player" + user.id);
                await client.from("game").update({ player: user.id }).eq("id", token);
            }

            // fetch user score
            let me = 0;

            if (user) {
                const { data } = await client
                    .from("users")
                    .select("score")
                    .eq("user_id", user.id)
                    .single();

                me = parseInt(data?.score);
            }

            // set
            setScore(me);
            setGameReady(true);
        }

        if (!score && user) {
            fetchData()
        }

        // realtime updates for game state
        const channel = client.channel("scores-live")
        .on("postgres_changes",
            {event: "*", schema: "basket", table: "game"},
            () => fetchData()
        )
        .subscribe()

        return () => {
            client.removeChannel(channel)
        }
    }, [score, user, loading])

    // leave game + release lock
    const leaveGame = async () => {
        setLoading(true);
        await client.from("game").update({ player: null }).eq("id", token);
        router.push("/leaderboard")
    }
    
    return (
        <>
        <Wrapper className="flex-col">
            {(user && !loading && gameReady) ? (
                <>
                {/* user stats inside game */}
                <UserStats user={user.id} />
                
                <div className="flex mt-4 gap-4">
                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {leaveGame()}}>
                        <ArrowBigLeft className="mr-1" />
                        Leave game
                    </Button>
                </div>
                </>
            ) : (
                <LoadingBox />
            )}
        </Wrapper>
        </>
    )
}