// === Account Page ===
// User account page
// - requires auth (via useAuth)
// - displays user info + stats
// - allows logout + navigation

"use client";

import { useRouter } from 'next/navigation';
import { ArrowBigRight, LogOut, Trash2 } from "lucide-react";
import { useEffect, useState } from "react"
import { Button, LoadingBox, UqacBox, Wrapper } from '@/components/uqac-utils';
import { formatDate, getClient } from '@/lib/uqac-lib';
import { useAuth } from '@/hooks/useAuth';
import UserStats from '@/components/user-stats';

export default function Account() {
	const client = getClient();
	const router = useRouter();
	const user = useAuth();

	const [userData, setUserData] = useState<any>();
	const [loading, setLoading] = useState(false);

	// sign out user + redirect
	const signOut = async () => {
		setLoading(true);
		await client.auth.signOut()
		router.push("/login");
	}

	// delete account
	const deleteAccount = async () => {
		const confirm = prompt("Are you sure you want to delete your account ? Type 'CONFIRM' to continue.")

		if (confirm == "CONFIRM") {
			setLoading(true)
			const { data: { session } } = await client.auth.getSession();
			await fetch("https://gphwidwmehfwigaowhyl.supabase.co/functions/v1/delete-user", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${session?.access_token}`,
				},
			});
			// todo: proper RLS
			await client.from("users").delete().eq("user_id", user.id)
			router.push("/login");
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			// fetch full user row from DB
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
		<Wrapper className="p-4 flex-col">
			{(user && userData && !loading) ? (
				<>
				<UqacBox className="w-[90%] h-[90%] text-black text-md md:text-[1.5rem] leading-[1.5rem] md:leading-[2.5rem] flex flex-col items-center justify-center" title={"👤 Account"}>
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

					<Button className="bg-red-500 hover:!bg-red-400 text-[1rem] p-1 mt-2" onClick={deleteAccount}>
						<Trash2 className="mr-1" />
						Delete account
					</Button>
				</UqacBox>

				{/* user stats (separate component) */}
				<div className="w-[90%] h-full flex flex-col items-center justify-center">
					<UserStats user={user.id} />
				</div>

				<div className="flex mt-4 gap-4">
					<Button onClick={signOut}>
                        <LogOut className="mr-1" />
                        Logout
                    </Button>

                    <Button onClick={(e: any) => {setLoading(true); router.push("/leaderboard")}}>
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