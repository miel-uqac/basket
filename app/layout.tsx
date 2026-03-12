"use client";

import TopBar from "@/components/top-bar";
import "./globals.css";
import BottomBar from "@/components/bottom-bar";

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={"flex flex-col bg-black/10 text-white"}>
				<TopBar />
				<div className="w-full h-full">
					{children}
				</div>
				<BottomBar />
			</body>
		</html>
	);
}
