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
            const { data, error } = await client.from("users").select("*").order("score", {ascending: false}).limit(10);
            if (data) {
                setScores(data)
            }
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
                <UqacBox className="w-[60%] h-[60%]" title={"Leaderboard"}>
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
                                {scores.map((r: any) => (
                                    <TableRow>
                                        <TableCell>{r.user_id}</TableCell>
                                        <TableCell>{r.username}</TableCell>
                                        <TableCell>{r.score}</TableCell>
                                    </TableRow>
                                ))}
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