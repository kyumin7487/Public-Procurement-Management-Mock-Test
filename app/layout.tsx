import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "공공조달관리사 모의고사",
    description: "공공조달관리사 필기시험 모의고사 웹사이트",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body>{children}</body>
        </html>
    );
}