"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, Loader2, Send } from "lucide-react";
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
		<Wrapper>
			{user ? (
				<UqacBox className="w-[90%] h-[90%] flex flex-col items-center justify-center" title={"Account"}>
					<Button onClick={signOut}>Logout</Button>
				</UqacBox>
			) : (
				<LoadingBox />
			)}
		</Wrapper>
	</>
}