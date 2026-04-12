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
import { useEffect, useRef, useState } from "react";

export default function GamePage() {
    const client = getClient()
    const router = useRouter();
    const user = useAuth();
    const [token, setToken] = useState("")
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [gameReady, setGameReady] = useState(false);
    const [isFirstCheck, setIsFirstCheck] = useState(true);

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

    // keep track of current state because of the effects hooks
    const stateRef = useRef(isFirstCheck);

    useEffect(() => {
        stateRef.current = isFirstCheck;
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            if (loading) {
                return;
            }

            // edge case for rolling ids
            const rollingId: any = await client.from("game").select("id").eq("last_id", token);

            // alert(JSON.stringify(rollingId))

            if (rollingId.data && rollingId.data.length != 0) {
                console.log(rollingId)
                router.push(`/game?token=${rollingId.data[0].last_id}`)
                return
            }

            // check game exists
            const gameExists: any = await client.from("game").select("player").eq("id", token);

            if (!gameExists.data || gameExists.data.length == 0) {
                setGameReady(false);
                if (isFirstCheck) {
                    alert("Game not found !");
                } else {
                    alert("You have been kicked !");
                }
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

            setIsFirstCheck(false)

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
                <div className="flex flex-col items-center justify-center w-[90%] h-[90%]">
                    <UserStats user={user.id} />
                </div>
                
                <div className="flex mb-4 gap-4">
                    <Button onClick={(e: any) => {leaveGame()}}>
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