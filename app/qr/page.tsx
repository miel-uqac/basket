"use client";

import { Button, LoadingBox, Wrapper } from "@/components/uqac-utils";
import { useAuth } from "@/hooks/useAuth";
import { checkQrData } from "@/lib/uqac-lib";
import jsQR from "jsqr";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function QrPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [videoReady, setVideoReady] = useState(false);
    const router = useRouter();
    const user = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        canvasRef.current = document.createElement("canvas");
    }, [])
    
    useEffect(() => {
        const start = async () => {
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false,
                })
            } catch (err) {
                alert(`cannot start camera ! ${err}`)
                return
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            videoRef.current!.onloadedmetadata = () => {
                videoRef.current!.play();
                const wait = () => {
                    if (videoRef.current!.videoWidth > 0) {
                        setVideoReady(true);
                        scan();
                    } else {
                        requestAnimationFrame(wait);
                    }
                }

                wait();
            }
        }

        if (user) {
            start();
        }
    }, [user])

    const scan = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);

        let imageData;
        try {
            imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
            return;
        }

        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
            const token = checkQrData(code.data)
            if (token != "") {
                setVideoReady(false);

                // stop video
                stopVideo();

                router.push(`/game?token=${token}`)

                return;
            }
        }

        requestAnimationFrame(scan);
    }

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    return (
        <>
        <Wrapper className="flex-col">
            {(user && !loading) ? (
                <>
                <div className="relative flex items-center justify-center w-[85%] h-[85%] overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 right-0 m-auto max-w-full max-h-full aspect-square rounded-md overflow-hidden border-4 border-uqac-green bg-uqac-green flex items-center justify-center">
                        {!videoReady && (
                            <LoadingBox />
                        )}
                        <video className="w-full h-full object-cover" ref={videoRef} autoPlay playsInline />
                    </div>
                </div>
                <Button className="mt-4 flex items-center justify-center border-2 border-white/40 font-bold" onClick={(e: any) => {setLoading(true); stopVideo(); router.push("/leaderboard")}}>
                    <ArrowBigLeft />
                    Go back
                </Button>
                </>
            ) : (
                <LoadingBox />
            )}
        </Wrapper>
        </>
    )
}