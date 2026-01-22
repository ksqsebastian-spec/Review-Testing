"use client";

import { useEffect, useState } from "react";
import { businesses } from "@/lib/businesses";
import QRCode from "qrcode";

export default function AdminPage() {
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // Get the base URL from the current window
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!baseUrl) return;

    // Generate QR codes for each business
    const generateQRCodes = async () => {
      const codes: Record<string, string> = {};

      for (const business of businesses) {
        const url = `${baseUrl}?business=${business.id}`;
        try {
          const qrDataUrl = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
          codes[business.id] = qrDataUrl;
        } catch (err) {
          console.error(`Failed to generate QR for ${business.name}:`, err);
        }
      }

      setQrCodes(codes);
    };

    generateQRCodes();
  }, [baseUrl]);

  const downloadQR = (businessId: string, businessName: string) => {
    const link = document.createElement("a");
    link.download = `qr-${businessName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = qrCodes[businessId];
    link.click();
  };

  const downloadAllQRs = async () => {
    for (const business of businesses) {
      if (qrCodes[business.id]) {
        downloadQR(business.id, business.name);
        // Small delay to prevent browser blocking multiple downloads
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600 mb-4">
            Download QR codes for each business to display at your locations
          </p>
          <button
            onClick={downloadAllQRs}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Download All QR Codes
          </button>
        </div>

        {/* QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {business.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{business.category}</p>

              {qrCodes[business.id] ? (
                <div className="flex flex-col items-center">
                  <img
                    src={qrCodes[business.id]}
                    alt={`QR Code for ${business.name}`}
                    className="w-48 h-48 mb-4"
                  />
                  <p className="text-xs text-gray-400 mb-4 break-all">
                    {baseUrl}?business={business.id}
                  </p>
                  <button
                    onClick={() => downloadQR(business.id, business.name)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Download QR
                  </button>
                </div>
              ) : (
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Download the QR codes for your businesses</li>
            <li>Print them and display at your business locations</li>
            <li>Customers scan the QR code with their phone camera</li>
            <li>They select their rating and preferences</li>
            <li>The app generates a review they can copy</li>
            <li>One click opens Google Reviews where they can paste and submit</li>
          </ol>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ← Back to Review Generator
          </a>
        </div>
      </div>
    </main>
  );
}
