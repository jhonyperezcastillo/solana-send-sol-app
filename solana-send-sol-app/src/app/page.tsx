"use client";

import dynamic from "next/dynamic";
import SendSolForm from "@/components/SendSolFrom";

const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Solana Send SOL App</h1>
      {/* Botón para conectar la billetera */}
      <WalletMultiButtonDynamic/>
      {/* Mostrar el formulario solo si la billetera está conectada */}
      <SendSolForm />
    </main>
  );
}
