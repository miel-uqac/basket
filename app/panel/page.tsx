// === PanelPage ===
// Admin/control panel for the game system
// - requires auth + admin access (/panel protected by useAuth)
// - manages game session token rotation
// - tracks current player + inactivity timeout
// - can award score (+10)
// - displays QR code for joining game
// - shows live leaderboard + player stats

"use client";

import Leaderboard from "@/components/leaderboard";
import QrCodeImg from "@/components/qrcode-img";
import { Button, UqacBox, Wrapper } from "@/components/uqac-utils";
import UserStats from "@/components/user-stats";
import { useAuth } from "@/hooks/useAuth";
import { getClient } from "@/lib/uqac-lib";
import { useEffect, useRef, useState } from "react";

export default function PanelPage() {
    const client = getClient()
    const user = useAuth();

    const [token, setToken] = useState("");
    const refreshTime = parseInt(process.env.NEXT_PUBLIC_GAME_REFRESH || "0");
    const inactivityTime = parseInt(process.env.NEXT_PUBLIC_IDLE_REFRESH || "0");

    const [countdown, setCountdown] = useState(refreshTime); // refresh
    const [inactivity, setInactivty] = useState(inactivityTime);
    const [currentPlayer, setCurrentPlayer] = useState();
    
    // add score to current player, what you can then link to the python for scoring
    const update = async () => {
        const { data } = await client
            .from("users")
            .select("score")
            .eq("user_id", currentPlayer)
            .single();
        
        if (!data) return;

        await client
            .from("users")
            .update({ score: data.score + 10 })
            .eq("user_id", currentPlayer);
        
        setInactivty(inactivityTime); // reset inactivity
    }

    // generate new game token + reset game row (and kick players in the process)
    const updateToken = async () => {
        const uuid = window.crypto.randomUUID();
        setToken(uuid);
        setCountdown(refreshTime);

        // remove old row
        await client.from("game").delete().eq("pk", 1);

        // add new row
        await client.from("game").insert([{pk: 1, id: uuid}]);
    }

    // keep track of current player because of the effects hooks
    const currentPlayerRef = useRef(currentPlayer);
    
    useEffect(() => {
        currentPlayerRef.current = currentPlayer;
    }, [currentPlayer]);

    // game refresh loop
    useEffect(() => {
        updateToken();

        const interval = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    updateToken();
                    return refreshTime;
                }

                if (!currentPlayerRef.current) {
                    return c - 1;
                }

                return refreshTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // inactivity loop & kicks player if idle
    useEffect(() => {
        const interval = setInterval(() => {
            setInactivty((c) => {
                if (c <= 1) {
                    kickPlayer();
                    clearInterval(interval);
                    return inactivityTime;
                }

                if (currentPlayerRef.current) {
                    return c - 1;
                }

                return c;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // fetch current player from game table
    useEffect(() => {
        const fetchData = async () => {
            console.log("update")
            console.log(token)
            if (!token) {
                return;
            }
            const currentPlayer: any = await client.from("game").select("player").eq("id", token);
            console.log(currentPlayer)
            if (currentPlayer.data.length == 0) {
                setCurrentPlayer(undefined);
                setCountdown(refreshTime);
            } else {
                setCurrentPlayer(currentPlayer.data[0].player);
                setInactivty(inactivityTime);
            }
        }

        const channel = client.channel("scores-live")
        .on("postgres_changes",
            {event: "*", schema: "basket", table: "game"},
            () => fetchData()
        )
        .subscribe()

        return () => {
            client.removeChannel(channel)
        }
    }, [token])

    // force reset session
    const kickPlayer = async () => {
        updateToken();
    }
    
    return (
        <>
        <Wrapper className="flex gap-4 p-4">
            {user && (
                <>
                {/* leaderboard follows current player */}
                <Leaderboard user={currentPlayer} />

                {/* control panel */}
                <div className="h-full flex flex-col gap-4">
                    <UqacBox className="h-full flex flex-col gap-2" title="Debug">
                        <Button className="mb-4 text-[3rem]" onClick={update}>+10</Button>

                        <Button disabled={!currentPlayer} onClick={kickPlayer}>kick player</Button>

                        <div className="flex flex-col text-black gap-2">
                            <span>game refresh : {countdown}</span>
                            <span>player inactivity : {inactivity}</span>
                            <span>game token : {token}</span>
                            <span>player : {currentPlayer ? currentPlayer : "nobody"}</span>
                        </div>

                        {/* QR for joining game */}
                        <QrCodeImg disabled={currentPlayer} code={`${process.env.NEXT_PUBLIC_PROJECT_URL}/game?token=${token}`} />
                    </UqacBox>
                </div>

                {/* player stats or empty state */}
                {currentPlayer ? (
                    <div className="w-[500px] max-h-[700px]">
                        <UserStats user={currentPlayer} />
                    </div>
                ) : (
                    <UqacBox className="flex flex-col items-center justify-center" title="Stats">
                        <span className="text-black">Nobody is playing...</span>
                    </UqacBox>
                )}
                </>
            )}
        </Wrapper>
        </>
    )
}