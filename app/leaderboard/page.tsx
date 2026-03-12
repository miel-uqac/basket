"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UqacBox, Wrapper } from "@/components/uqac-utils";
import { getClient } from "@/lib/uqac-lib";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
    const client = getClient()
    const [scores, setScores] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await client.from("users").select("*").order("score", {ascending: false}).limit(10);
            if (data) {
                setScores(data)
            }
        }

        if (!scores) {
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
    }, [scores])
    
    return (
        <Wrapper>
            <UqacBox title={"Leaderboard"}>
                {scores && (
                    <Table className="text-black">
                        <TableHeader>
                            <TableRow>
                                <TableHead>user_id</TableHead>
                                <TableHead>username</TableHead>
                                <TableHead>score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scores.map((r: any) => (
                                <TableRow>
                                    <TableCell>{r.user_id}</TableCell>
                                    <TableCell>{r.username}</TableCell>
                                    <TableCell>{r.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </UqacBox>
        </Wrapper>
    )
}