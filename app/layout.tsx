"use client";

import "./globals.css";
import { createClient } from '@supabase/supabase-js'


export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

	// const { data, error } = await supabase.auth.signInWithPassword({
	// 	email: 'example@email.com',
	// 	password: 'example-password',
	// })

	return (
		<html lang="en">
			<body className={""}>{children}</body>
		</html>
	);
}
