"use client";

import Leaderboard from "@/components/leaderboard";
import QrCodeImg from "@/components/qrcode-img";
import { Button, UqacBox, Wrapper } from "@/components/uqac-utils";
import UserStats from "@/components/user-stats";
import { getClient } from "@/lib/uqac-lib";
import { useEffect, useRef, useState } from "react";

export default function TestPage() {
    const client = getClient()
    const [token, setToken] = useState("");
    const refreshTime = 300; // 5mn
    const inactivityTime = 180; // 3mn
    const [countdown, setCountdown] = useState(refreshTime); // refresh
    const [inactivity, setInactivty] = useState(inactivityTime);
    const [currentPlayer, setCurrentPlayer] = useState();
    
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
        
        setInactivty(inactivityTime);
    }

    const updateToken = async () => {
        const uuid = window.crypto.randomUUID();
        setToken(uuid);
        setCountdown(refreshTime);

        // remove old row
        await client.from("game").delete().eq("pk", 1);

        // add new row
        await client.from("game").insert([{pk: 1, id: uuid}]);
    }

    const currentPlayerRef = useRef(currentPlayer);

    useEffect(() => {
        currentPlayerRef.current = currentPlayer;
    }, [currentPlayer]);

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

    const kickPlayer = async () => {
        updateToken();
    }
    
    return (
        <>
        <Wrapper className="flex gap-4 p-4">
            <Leaderboard user={currentPlayer} />

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

                    <QrCodeImg disabled={currentPlayer} code={`https://miel-uqac.github.io/basket/game?token=${token}`} />
                </UqacBox>
            </div>

            {currentPlayer ? (
                <div className="w-[500px] max-h-[700px]">
                    <UserStats user={currentPlayer} />
                </div>
            ) : (
                <UqacBox className="flex flex-col items-center justify-center" title="Stats">
                    <span className="text-black">Nobody is playing...</span>
                </UqacBox>
            )}
            
        </Wrapper>
        </>
    )
}