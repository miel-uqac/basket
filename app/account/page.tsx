"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react"
import { Button, LoadingBox, UqacBox } from '@/components/uqac-utils';

export default function Account() {
	const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "")
	const router = useRouter();
	const [user, setUser] = useState<any>();

	useEffect(() => {
		const getUser = async () => {
			const user = await supabase.auth.getUser()
			console.log(user)
			if (user.error) {
				router.push("/login")
			}
			setUser(user.data.user)
		}
		if (!user) {
			getUser()
		}
	}, [user])

	const signOut = async () => {
		await supabase.auth.signOut()
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