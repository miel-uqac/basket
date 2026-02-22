"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react"

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
		<div className="border-2 border-red-500 w-full h-full flex items-center justify-center">
			{user ? (
				<div className="border-2 border-purple-500 w-[50%] h-[50%] flex flex-col items-center justify-center">

				</div>
			) : (
				<span className='flex items-center justify-center'>
					<Loader2 className="mr-2 transition animate-spin" />
					Loading
				</span>
			)}
		</div>
	</>
}