"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react"
import { Button, LoadingBox, UqacBox } from '@/components/uqac-utils';
import { getClient, getUser } from '@/lib/uqac-lib';

export default function Account() {
	const client = getClient();
	const router = useRouter();
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

	const signOut = async () => {
		await client.auth.signOut()
		router.push("/login");
	}

	return <>
		<div className="border-2 w-full h-full flex items-center justify-center">
			{user ? (
				<UqacBox className="w-[90%] h-[90%] flex flex-col items-center justify-center" title={"Account"}>
					<Button onClick={signOut}>Logout</Button>
				</UqacBox>
			) : (
				<LoadingBox />
			)}
		</div>
	</>
}