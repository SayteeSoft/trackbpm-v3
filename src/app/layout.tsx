
import type {Metadata} from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Toaster } from "@/components/ui/toaster"
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export const metadata: Metadata = {
  title: 'TRACK ⚡ BPM',
  description: 'A simple tool to find the BPM of your favorite songs.',
};

const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
    "enable-funding": "paylater,venmo,card",
    "disable-funding": "",
    "data-sdk-integration-source": "developer-studio",
    currency: "GBP"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <PayPalScriptProvider options={{
          clientId: process.env.PAYPAL_CLIENT_ID || "AfJ7bhG_VDx0Z2o_EtExWS_Ps2eUiZKS0lABsQCbQC02V-c_Z59cOw8xq3yNqO763BAKwSRAf8n7fob8",
          currency: "GBP",
          components: "buttons",
          "enable-funding": "paylater,venmo,card",
          "data-sdk-integration-source": "developer-studio"
        }}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Chatbot />
              <Toaster />
            </div>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
