"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react"
import { Button, InputBox, LoadingBox, UqacBox, Wrapper } from '@/components/uqac-utils';
import { getClient, getUser } from '@/lib/uqac-lib';

export default function Login() {
	const client = getClient();
	const router = useRouter();

	const [isReady, setIsReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [m, setM] = useState("");
	const [p, setP] = useState("");
	const [err, setErr] = useState("");

	useEffect(() => {
		const checkUser = async () => {
			const user = await getUser(client)
			if (user) {
				router.push("/account")
			} else {
				setIsReady(true)
			}
		}
		if (!isReady) {checkUser()}
	}, [isReady])

	const login = async () => {
		setIsLoading(true);
		setErr("");

		const { data, error } = await client.auth.signInWithPassword({
			email: m,
			password: p,
		})

		if (error) {
			setIsLoading(false);
			setErr(error.toString());
		} else {
			router.push("/account")
		}
	}

	return <>
		<Wrapper>
			{isReady ? (
				<UqacBox className="w-[50%] h-[50%] flex flex-col items-center justify-center" title={"Login"}>

					<InputBox placeholder={"email"} onChange={(e:any)=>setM(e.target.value)} type={"email"} className="mb-2" />

					<InputBox placeholder={"password"} onChange={(e:any)=>setP(e.target.value)} type={"password"} />
					
					<Button disabled={isLoading} onClick={(e: any) => {login()}} className={`m-2 flex items-center justify-center border-2 border-white/40`}>
						{isLoading ? (
							<Loader2 className="transition animate-spin mr-1" size={20} />
						) : (
							<Send className="mr-1" size={20} />
						)}
						Confirm
					</Button>
					<span className="text-red-500 h-[10px]">{err}</span>
				</UqacBox>
			) : (
				<LoadingBox />
			)}
		</Wrapper>
	</>
}