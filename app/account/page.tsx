"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, ArrowBigLeft, Loader2, LogOut, Send } from "lucide-react";
import { useEffect, useState } from "react"
import { Button, LoadingBox, UqacBox, Wrapper } from '@/components/uqac-utils';
import { getClient, getUser } from '@/lib/uqac-lib';
import { useAuth } from '@/hooks/useAuth';

export default function Account() {
	const client = getClient();
	const router = useRouter();
	const user = useAuth();

	const signOut = async () => {
		await client.auth.signOut()
		router.push("/login");
	}

	return <>
		<Wrapper className="flex-col">
			{user ? (
				<>
				<UqacBox className="w-[90%] h-[90%] flex flex-col items-center justify-center" title={"Account"}>
					{/* <Button onClick={signOut}>Logout</Button> */}
				</UqacBox>

				<div className="flex mt-4 gap-4">
                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {router.push("/leaderboard")}}>
                        <ArrowBigLeft />
                        Go back
                    </Button>

                    <Button className="flex items-center justify-center border-2 border-white/40 font-bold" onClick={signOut}>
                        <LogOut />
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