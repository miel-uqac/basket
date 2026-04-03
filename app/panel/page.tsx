"use client";

import QrCodeImg from "@/components/qrcode-img";
import { Button, Wrapper } from "@/components/uqac-utils";
import { getClient } from "@/lib/uqac-lib";
import { useEffect, useRef, useState } from "react";

export default function TestPage() {
    const client = getClient()
    const [token, setToken] = useState("");
    const refreshTime = 60;
    const [countdown, setCountdown] = useState(refreshTime); // refresh
    
    const update = async () => {
        const { data } = await client
            .from("users")
            .select("score")
            .eq("user_id", "da709ef0-0e30-40be-b4a9-1b03f51d9140")
            .single();
        
        if (!data) return;

        await client
            .from("users")
            .update({ score: data.score + 10 })
            .eq("user_id", "da709ef0-0e30-40be-b4a9-1b03f51d9140");
    }

    const updateToken = async () => {
        const uuid = window.crypto.randomUUID();
        setToken(uuid);

        // remove old row
        await client.from("game").delete().eq("pk", 1);

        // add new row
        await client.from("game").insert([{pk: 1, id: uuid}]);
    }

    const ran = useRef(false);
    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        updateToken();

        const interval = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    updateToken();
                    return refreshTime;
                }
                return c-1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [refreshTime]);
    
    return (
        <>
        <Wrapper>
            <Button className="text-[10rem]" onClick={update}>
            +10
            </Button>

            <div className="flex flex-col text-black gap-2">
                <span>{countdown}</span>
                <span>{token}</span>
            </div>

            <QrCodeImg code={`https://miel-uqac.github.io/basket/game?token=${token}`} />
        </Wrapper>
        </>
    )
}