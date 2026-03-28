"use client";

import { Button, Wrapper } from "@/components/uqac-utils";
import { getClient } from "@/lib/uqac-lib";

export default function TestPage() {
    const client = getClient()
    
    
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
    
    return (
        <>

        <Wrapper>

            <Button className="text-[10rem]" onClick={update}>
            +10
            </Button>
        </Wrapper>
        
        
        
        </>
    )
}