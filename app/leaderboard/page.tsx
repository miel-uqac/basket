"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingBox, UqacBox, Wrapper } from "@/components/uqac-utils";
import { getClient, getUser } from "@/lib/uqac-lib";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
    const client = getClient()
    const router = useRouter();
    const [scores, setScores] = useState<any>();
    const [user, setUser] = useState<any>();

    useEffect(() => {
        const checkUser = async () => {
            const user = await getUser(client)
            if (!user) {
                router.push("/login")
            }
            setUser(user)
        }
        if (!user) {checkUser()}
    }, [user])

    useEffect(() => {
        const fetchData = async () => {
            // top 10
            const { data: top } = await client
                .from("users")
                .select("*")
                .order("score", { ascending: false })
                .limit(10);
            // ourselves
            let me = null;

            if (user) {
                const { data } = await client
                    .from("users")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                me = data;
            }
            // add us if not in top 10
            let final = top || [];

            if (me && !final.some((r: any) => r.user_id === me.user_id)) {
                final = [...final, me]; // bottom
            }
            // set
            setScores(final);
        }

        if (!scores && user) {
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
    }, [scores, user])
    
    return (
        <Wrapper>
            {user ? (
                <UqacBox className="w-[95%] h-[95%]" title={"Leaderboard"}>
                    {scores ? (
                        <Table className="text-black">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>user_id</TableHead>
                                    <TableHead>username</TableHead>
                                    <TableHead>score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scores.map((r: any, i: number) => {
                                    const isMe = r.user_id === user?.id;

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
                                        <TableRow key={r.user_id} className={`${color} hover:${color} ${isMe && "font-bold"}`}>
                                            <TableCell>{r.user_id}</TableCell>
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
            ) : (
                <LoadingBox />
            )}
        </Wrapper>
    )
}