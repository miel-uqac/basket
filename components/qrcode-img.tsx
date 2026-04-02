"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrCodeImg({code=""}: {code?: string}) {
    const [qr, setQr] = useState("");

    useEffect(() => {
        QRCode.toDataURL(code).then(setQr);
    }, [code]);

    return <img src={qr} />;
}