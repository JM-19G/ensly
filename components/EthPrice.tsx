"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { sepolia } from "wagmi/chains";

const FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306" as const;

const abi = [
  {
    name: "latestRoundData",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
  },
] as const;

export function useEthPrice() {
  const { data } = useReadContract({
    address: FEED,
    abi,
    functionName: "latestRoundData",
    chainId: sepolia.id,
    query: { refetchInterval: 15000 },
  });
  if (!data) return undefined;
  return { price: Number(data[1]) / 1e8, updatedAt: Number(data[3]) };
}

function formatAge(seconds: number) {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export default function EthPrice() {
  const info = useEthPrice();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000));
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm">
      <span className="text-neutral-400">ETH / USD (Chainlink, Sepolia): </span>
      {info ? (
        <>
          <span className="font-semibold">
            ${info.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          {now && (
            <span className="ml-2 text-neutral-500">
              updated {formatAge(Math.max(0, now - info.updatedAt))}
            </span>
          )}
        </>
      ) : (
        <span className="text-neutral-500">loading...</span>
      )}
    </div>
  );
}