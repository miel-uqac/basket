"use client";

import { Button, LoadingBox, UqacBox, Wrapper } from "@/components/uqac-utils";
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
            // ourselves
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
        }

        if (!score && user) {
            fetchData()
        }

        const channel = client.channel("scores-live")
        .on("postgres_changes",
            {event: "*", schema: "basket", table: "users"},
            () => fetchData()
        )
        .subscribe()

        return () => {
            client.removeChannel(channel)
        }
    }, [score, user])
    
    return (
        <>
        <Wrapper className="flex-col">
            {user ? (
                <>
                <UqacBox className="w-[95%] h-[95%] text-black text-[2.5rem] leading-[3.5rem]" title={"Game"}>
                    {true ? (
                        <>
                        <div>
                            <span className="font-bold">Goals : </span>
                            <span>{score}</span>
                        </div>
                        <div>
                            <span className="font-bold">Accuracy : </span>
                            <span>...</span>
                        </div>
                        <div>
                            <span className="font-bold">Best streak : </span>
                            <span>...%</span>
                        </div>
                        <div>
                            <span className="font-bold">Most launched item : </span>
                            <span>...</span>
                        </div>
                        </>
                    ) : (
                        <LoadingBox className="w-full h-full" />
                    )}
                </UqacBox>
                
                <div className="flex mt-4 gap-4">
                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {router.push("/leaderboard")}}>
                        <ArrowBigLeft className="mr-1" />
                        Account
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