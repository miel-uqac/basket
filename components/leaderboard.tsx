"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, LoadingBox, UqacBox, Wrapper } from "@/components/uqac-utils";
import { useAuth } from "@/hooks/useAuth";
import { getClient, getUser } from "@/lib/uqac-lib";
import { ArrowBigLeft, Play, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Leaderboard({user}: {user: any}) {
    const client = getClient()
    const [scores, setScores] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            // top 10
            const { data: top } = await client
                .from("users")
                .select("*")
                .order("score", { ascending: false })
                .limit(10);

            // attach rank to top
            const topWithRank = await Promise.all(
                (top || []).map(async (u: any) => {
                const { count } = await client
                    .from("users")
                    .select("*", { count: "exact", head: true })
                    .gt("score", u.score);

                return { ...u, rank: (count ?? 0) + 1 };
                })
            );

            // ourselves
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

            // merge
            let final = topWithRank;

            if (me) {
                const alreadyInTop = final.some((r: any) => r.user_id === me.user_id);

                if (!alreadyInTop) {
                    final = [...final.slice(0, 9), me]; // keep 9 + user
                }
            }

            final.sort((a: any, b: any) => a.rank - b.rank);

            setScores(final);
        };

        fetchData()

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
        <UqacBox className="w-[95%] h-[95%]" title={"Leaderboard"}>
            <span className="text-black">cu -&gt; {user}</span>
            
            {scores ? (
                <Table className="text-black w-full">
                    <TableHeader>
                        <TableRow>
                            {/* <TableHead>user_id</TableHead> */}
                            <TableHead>position</TableHead>
                            <TableHead>username</TableHead>
                            <TableHead>score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="w-full">
                        {scores.map((r: any, i: number) => {
                            const isMe = r.user_id === user;

                            let color = "";
                            let medal = "";
                            if (i === 0) { 
                                color = "bg-yellow-400";
                                medal = "🥇 ";
                            }
                            else if (i === 1) {
                                color = "bg-gray-400";
                                medal = "🥈 ";
                            }
                            else if (i === 2) {
                                color = "bg-orange-400";
                                medal = "🥉 ";
                            }

                            if (isMe) color = "bg-blue-400";

                            return (
                                <TableRow key={r.user_id} className={`${color} truncate hover:${color} ${isMe && "font-bold"}`}>
                                    {/* <TableCell>{r.user_id}</TableCell> */}
                                    <TableCell>{r.rank}</TableCell>
                                    <TableCell>{medal}{r.username} {isMe && ("(you)")} - {r.user_id}</TableCell>
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