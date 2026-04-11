"use client";

import { LoadingBox } from "@/components/uqac-utils";
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
	// this page is not implemented as everything is elsewhere, therefore we just redirect
	const router = useRouter()

	useEffect(() => {
		router.push("/leaderboard")
	}, [])

	return <LoadingBox />
}