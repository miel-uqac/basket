"use client";

import { LoadingBox, Wrapper } from "@/components/uqac-utils";
import { checkQrData } from "@/lib/uqac-lib";
import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

export default function QrPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        canvasRef.current = document.createElement("canvas");
    }, [])
    
    useEffect(() => {
        const start = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            })

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

        start();
    }, [])

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
                console.log("token : " + token)
                setVideoReady(false);

                // stop video
                if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                    videoRef.current.srcObject = null;
                }

                return;
            }
        }

        requestAnimationFrame(scan);
    }

    return (
        <>
        <Wrapper>
            <div className="relative flex items-center justify-center w-[90%] h-[90%] overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 right-0 m-auto max-w-full max-h-full aspect-square rounded-md overflow-hidden border-4 border-uqac-green bg-uqac-green flex items-center justify-center">
                    {!videoReady && (
                        <LoadingBox />
                    )}
                    <video className="w-full h-full object-cover" ref={videoRef} autoPlay playsInline />
                </div>
            </div>
        </Wrapper>
        </>
    )
}