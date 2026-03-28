"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, ArrowBigLeft, Loader2, LogOut, Send } from "lucide-react";
import { useEffect, useState } from "react"
import { Button, LoadingBox, UqacBox, Wrapper } from '@/components/uqac-utils';
import { formatDate, getClient, getUser } from '@/lib/uqac-lib';
import { useAuth } from '@/hooks/useAuth';

export default function Account() {
	const client = getClient();
	const router = useRouter();
	const user = useAuth();

	const [userData, setUserData] = useState<any>();

	const signOut = async () => {
		await client.auth.signOut()
		router.push("/login");
	}

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await client
				.from("users")
				.select("*")
				.eq("user_id", user.id)
				.single();
			setUserData(data);
		}

		if (!userData && user) {
			fetchData()
		}
	}, [userData, user])

	return <>
		<Wrapper className="flex-col">
			{(user && userData) ? (
				<>
				<UqacBox className="w-[90%] h-[90%] text-black text-[1.5rem] leading-[2.5rem] flex flex-col items-center justify-center" title={"Account"}>
					<div>
						<span className="font-bold">Username : </span>
						<span>{userData.username}</span>
					</div>
					<div>
						<span className="font-bold">Mail : </span>
						<span>{user.email}</span>
					</div>
					<div>
						<span className="font-bold">Account creation : </span>
						<span>{formatDate(user.created_at)}</span>
					</div>
					<div>
						<span className="font-bold">Last login : </span>
						<span>{formatDate(user.last_sign_in_at)}</span>
					</div>

					<hr className="border-0 h-[2px] bg-black w-full mt-4 mb-4" />

					<div>
						<span className="font-bold">Games count : </span>
						<span>...</span>
					</div>
					<div>
						<span className="font-bold">Goals : </span>
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
				</UqacBox>

				<div className="flex mt-4 gap-4">
                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {router.push("/leaderboard")}}>
                        <ArrowBigLeft className="mr-1" />
                        Go back
                    </Button>

                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={signOut}>
                        <LogOut className="mr-1" />
                        Logout
                    </Button>
                </div>
				</>
			) : (
				<LoadingBox />
			)}
		</Wrapper>
	</>
}