"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, ArrowBigLeft, ArrowBigRight, Loader2, LogOut, Send } from "lucide-react";
import { useEffect, useState } from "react"
import { Button, LoadingBox, UqacBox, Wrapper } from '@/components/uqac-utils';
import { formatDate, getClient, getUser } from '@/lib/uqac-lib';
import { useAuth } from '@/hooks/useAuth';
import UserStats from '@/components/user-stats';

export default function Account() {
	const client = getClient();
	const router = useRouter();
	const user = useAuth();

	const [userData, setUserData] = useState<any>();
	const [loading, setLoading] = useState(false);

	const signOut = async () => {
		setLoading(true);
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
		<Wrapper className="p-4 flex-col gap-4">
			{(user && userData && !loading) ? (
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
				</UqacBox>

				<UserStats user={user.id} />

				<div className="flex mt-4 gap-4">
					<Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={signOut}>
                        <LogOut className="mr-1" />
                        Logout
                    </Button>

                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {setLoading(true); router.push("/leaderboard")}}>
                        <ArrowBigRight className="mr-1" />
                        Go back
                    </Button>
                </div>
				</>
			) : (
				<LoadingBox />
			)}
		</Wrapper>
	</>
}