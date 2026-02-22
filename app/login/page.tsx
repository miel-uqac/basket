"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react"

export default function Login() {
	const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "")
	const router = useRouter();

	const [isReady, setIsReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [m, setM] = useState("");
	const [p, setP] = useState("");
	const [err, setErr] = useState("");

	useEffect(() => {
		const getUser = async () => {
			const user = await supabase.auth.getUser()
			console.log(user)
			if (user.data.user) {
				router.push("/account")
			} else {
				setIsReady(true)
			}
		}
		if (!isReady) {
			getUser()
		}
	}, [isReady])

	const login = async () => {
		setIsLoading(true);
		setErr("");

		const { data, error } = await supabase.auth.signInWithPassword({
			email: m,
			password: p,
		})

		if (error) {
			setIsLoading(false);
			setErr(error.toString());
		} else {
			router.push("/login")
		}
	}

	return <>
		<div className="border-2 border-red-500 w-full h-full flex items-center justify-center">
			{isReady ? (
				<div className="border-2 border-purple-500 w-[50%] h-[50%] flex flex-col items-center justify-center">
					<input onChange={e=>setM(e.target.value)} placeholder="email"></input>
					<input className="text-black" onChange={e=>setP(e.target.value)} placeholder="password"></input>
					<button disabled={isLoading} onClick={(e) => {login()}} className={`p-2 rounded-md m-2 flex items-center justify-center border-2 border-white/40 transition ${isLoading ? "text-white/60" : "hover:border-white/80 hover:cursor-pointer"}`}>
						{isLoading ? (
							<Loader2 className="transition animate-spin mr-1" size={20} />
						) : (
							<Send className="mr-1" size={20} />
						)}
						Confirm
					</button>
					<span className="text-red-500">{err}</span>
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