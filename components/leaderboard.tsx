// === Leaderboard ===
// Client component displaying top users by score
// - fetches top N users + current user rank
// - keeps current user visible even if outside top
// - updates in realtime via Supabase channel
// Props:
// - user: current user_id
// - max: total elements in list (default is 10)
// Usage:
// <Leaderboard user={userId} />

"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingBox, UqacBox } from "@/components/uqac-utils";
import { getClient } from "@/lib/uqac-lib";
import { useEffect, useState } from "react";

export default function Leaderboard({user, max=10}: {user: any, max?: number}) {
    const client = getClient()
    const [scores, setScores] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            // get top users ordered by score
            const { data: top } = await client
                .from("users")
                .select("*")
                .order("score", { ascending: false })
                .limit(max);

            // compute rank for each top user
            const topWithRank = await Promise.all(
                (top || []).map(async (u: any) => {
                const { count } = await client
                    .from("users")
                    .select("*", { count: "exact", head: true })
                    .gt("score", u.score);

                return { ...u, rank: (count ?? 0) + 1 };
                })
            );

            // fetch current user
            let me = null;

            if (user) {
                const { data } = await client
                .from("users")
                .select("*")
                .eq("user_id", user)
                .single();

                if (data) {
                const { count } = await client
                    .from("users")
                    .select("*", { count: "exact", head: true })
                    .gt("score", data.score);

                me = { ...data, rank: (count ?? 0) + 1 };
                }
            }

            // merge top + current user if not already included
            let final = topWithRank;

            if (me) {
                const alreadyInTop = final.some((r: any) => r.user_id === me.user_id);

                if (!alreadyInTop) {
                    final = [...final.slice(0, max - 1), me]; // keep total + user
                }
            }

            // sort by rank and display
            final.sort((a: any, b: any) => a.rank - b.rank);
            setScores(final);
        };

        fetchData()

        // realtime updates on "users" table
        const channel = client.channel("scores-live")
        .on("postgres_changes",
            {event: "*", schema: "basket", table: "users"},
            () => fetchData()
        )
        .subscribe()

        return () => {
            client.removeChannel(channel)
        }
    }, [user])
    
    return (
        <UqacBox className="w-[95%] h-[95%]" title={"📈 Leaderboard"}>
            {scores ? (
                <Table className="text-black w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>📊 Position</TableHead>
                            <TableHead>📌 Username</TableHead>
                            <TableHead>🎰 Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="w-full">
                        {scores.map((r: any, i: number) => {
                            const isMe = r.user_id === user;

                            let color = "";
                            let medal = "";
                            if (i === 0) {  // 1st
                                color = "bg-yellow-400";
                                medal = "🥇 ";
                            }
                            else if (i === 1) { // 2nd
                                color = "bg-gray-400";
                                medal = "🥈 ";
                            }
                            else if (i === 2) { // 3rd
                                color = "bg-orange-400";
                                medal = "🥉 ";
                            }

                            if (isMe) color = "bg-blue-400";

                            return (
                                <TableRow key={r.user_id} className={`${color} truncate hover:${color} ${isMe && "font-bold"}`}>
                                    <TableCell>n°{r.rank}</TableCell>
                                    <TableCell>{medal}{r.username} {isMe && ("(you)")}</TableCell>
                                    <TableCell>{r.score}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            ) : (
                <LoadingBox className="w-full h-full" />
            )}
        </UqacBox>
    )
}