"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function SendSolForm() {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTxSignature(null);

    if (!connection || !publicKey) {
      setError("Billetera no conectada o conexión no disponible.");
      return;
    }

    try {
      setLoading(true);
      // Validar y convertir la dirección de destino
      const recipientPubkey = new PublicKey(destination);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      if (isNaN(lamports) || lamports <= 0) {
        setError("Ingrese una cantidad válida de SOL.");
        setLoading(false);
        return;
      }

      // Crear la transacción de transferencia
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        })
      );

      // Enviar la transacción y obtener la firma
      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
      setLoading(false);
    }
    
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-white">Enviar SOL</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="destination" className="block text-gray-200 mb-1">
            Dirección de destino
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            placeholder="Ingrese la dirección"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-200 mb-1">
            Cantidad de SOL
          </label>
          <input
            type="number"
            step="0.0001"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            placeholder="0.1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar SOL"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {txSignature && (
        <div className="mt-4">
          <p className="text-green-500">Transacción enviada con éxito!</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Ver en Solana Explorer
          </a>
        </div>
      )}
    </div>
  );
}
