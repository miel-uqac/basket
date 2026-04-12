// === UserStats ===
// Displays basic stats for current user
// - currently only "score" (mapped as Goals)
// - other fields are placeholders for future DB expansion
// - updates in realtime via Supabase channel
// Props:
// - user: current user_id
// Usage:
// <UserStats user={userId} />

"use client";

import { useEffect, useState } from "react"
import { LoadingBox, UqacBox } from '@/components/uqac-utils';
import { getClient } from '@/lib/uqac-lib';

export default function UserStats({user}: {user: any}) {
	const client = getClient();

	const [userData, setUserData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
            let me = 0;

            // fetch user score
			const { data } = await client
                .from("users")
                .select("score")
                .eq("user_id", user)
                .single();
            
            console.log(data)

            me = parseInt(data?.score);

            setUserData(me);
		}

        fetchData()

        // realtime updates on "users" table
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
        <UqacBox className="w-full h-full text-black text-xl md:text-[1.5rem] leading-[2rem] md:leading-[2.5rem] flex flex-col items-center justify-center" title={"📋 Stats"}>
            {(user && userData !== undefined) ? (
                <>
                <div>
                    <span className="font-bold">Goals : </span>
                    <span>{userData}</span>
                </div>

                {/* placeholders for future stats (depends on DB schema) */}
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