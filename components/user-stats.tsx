"use client";
import { useEffect, useState } from "react"
import { Button, LoadingBox, UqacBox, Wrapper } from '@/components/uqac-utils';
import { formatDate, getClient, getUser } from '@/lib/uqac-lib';

export default function UserStats({user}: {user: any}) {
	const client = getClient();

	const [userData, setUserData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
            let me = 0;

			const { data } = await client
                .from("users")
                .select("score")
                .eq("user_id", user)
                .single();

            me = parseInt(data?.score);

            setUserData(me);
		}

        fetchData()

        const channel = client.channel("scores-live")
        .on("postgres_changes",
            {event: "*", schema: "basket", table: "users"},
            () => fetchData()
        ).subscribe();

        return () => {
            client.removeChannel(channel)
        }
	}, [])

	return <>
        <UqacBox className="w-[90%] h-[90%] text-black text-[1.5rem] leading-[2.5rem] flex flex-col items-center justify-center" title={"Stats"}>
            {(user && userData) ? (
                <>
                <div>
                    <span className="font-bold">Goals : </span>
                    <span>{userData}</span>
                </div>
                <div>
                    <span className="font-bold">Games count : </span>
                    <span>...</span>
                </div>
                <div>
                    <span className="font-bold">Accuracy : </span>
                    <span>...%</span>
                </div>
                <div>
                    <span className="font-bold">Best streak : </span>
                    <span>...</span>
                </div>
                <div>
                    <span className="font-bold">Most launched item : </span>
                    <span>...</span>
                </div>
                </>
            ) : (
                <LoadingBox />
            )}
        </UqacBox>
	</>
}