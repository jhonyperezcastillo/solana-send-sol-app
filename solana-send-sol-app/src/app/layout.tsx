import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Inter } from "next/font/google";
import { WalletContextProvider } from "@/context/WalletContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solana Send SOL App",
  description: "App para enviar SOL entre billeteras",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
