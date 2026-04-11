"use client";

import { BottomBar, TopBar } from "@/components/page-elements";
import "./globals.css";

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={"flex flex-col bg-black/10 text-white overflow-hidden"}>
				<TopBar />
				<div className="w-full h-[calc(100%-105px)]">
					{children}
				</div>
				<BottomBar />
			</body>
		</html>
	);
}
