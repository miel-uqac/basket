"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrCodeImg({code="", disabled=false}: {code?: string, disabled?: boolean}) {
    const [qr, setQr] = useState("");

    useEffect(() => {
        QRCode.toDataURL(code).then(setQr);
    }, [code]);

    return <img className={`${disabled && "blur-sm"}`} src={qr} />;
}