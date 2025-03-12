import React from "react";
import QRCode from "react-qr-code";

const QRcode = () => {
    const googleFormUrl = "https://mlsc-coherence-25.web.app/realtime"; // Replace with actual form link

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl mb-4">Scan to Fill Team Member Details</h2>
            <QRCode value={googleFormUrl} size={200} />
            <p className="mt-2 text-gray-600">Scan this QR code to open the form</p>
        </div>
    );
};

export default QRcode;
