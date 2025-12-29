// React & Next.js core
import type { Metadata } from "next";
import { draftMode } from "next/headers";

// Third-party libraries
import { Toaster } from "react-hot-toast";

// SDKs (Sanity, Clerk, Google)
import { VisualEditing } from "next-sanity";
import { SanityLive } from "@/sanity/lib/live";

// Internal absolute imports (@/)
import DisableDraftMode from "@/components/DisableDraftMode";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ChatIcon from "@/components/new/ChatIcon";
import CompareFloatingBar from "@/components/CompareFloatingBar";

export const metadata: Metadata = {
  title: "Al-Tahoor healthcare",
  description: "Premium Medicated Personal Care Products",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Header />
      {children}
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#fff",
          },
        }}
      />
      <SanityLive />
      <ChatIcon />
      <CompareFloatingBar />
    </div>
  );
}
