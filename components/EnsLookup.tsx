"use client";

import { useState } from "react";
import { useEnsAddress, useEnsAvatar, useEnsText, useBalance } from "wagmi";
import { normalize } from "viem/ens";
import { formatEther } from "viem";
import { mainnet } from "wagmi/chains";
import { useEthPrice } from "./EthPrice";

function safeNormalize(value: string) {
  try {
    return normalize(value.trim());
  } catch {
    return undefined;
  }
}

export default function EnsLookup() {
  const [input, setInput] = useState("");
  const [name, setName] = useState<string | undefined>();
  const enabled = !!name;

  const { data: address, isLoading } = useEnsAddress({
    name,
    chainId: mainnet.id,
    query: { enabled },
  });
  const { data: avatar } = useEnsAvatar({
    name,
    chainId: mainnet.id,
    query: { enabled },
  });
  const { data: description } = useEnsText({
    name,
    key: "description",
    chainId: mainnet.id,
    query: { enabled },
  });
  const { data: twitter } = useEnsText({
    name,
    key: "com.twitter",
    chainId: mainnet.id,
    query: { enabled },
  });
  const { data: balance } = useBalance({
    address: address ?? undefined,
    chainId: mainnet.id,
    query: { enabled: !!address },
  });

  const ethPrice = useEthPrice();
  const eth = balance ? Number(formatEther(balance.value)) : undefined;
  const usd = eth !== undefined && ethPrice ? eth * ethPrice.price : undefined;
  const handle = twitter?.replace(/^@/, "");

  return (
    <section className="mt-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setName(safeNormalize(input));
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="vitalik.eth"
          className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-blue-500"
        />
        <button className="rounded-xl bg-blue-500 px-5 py-3 font-semibold">
          Look up
        </button>
      </form>

      {isLoading && <p className="mt-4 text-sm text-neutral-400">Resolving...</p>}

      {name && !isLoading && !address && (
        <p className="mt-4 text-sm text-neutral-400">
          No address found for this name
        </p>
      )}

      {address && (
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-center gap-4">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-neutral-800" />
            )}
            <div className="min-w-0">
              <p className="text-xl font-bold">{name}</p>
              <p className="truncate text-xs text-neutral-400">{address}</p>
            </div>
          </div>

          {description && (
            <p className="mt-4 text-sm text-neutral-300">{description}</p>
          )}

          {handle && (
            <a
              href={`https://x.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-blue-400"
            >
              @{handle}
            </a>
          )}

          <div className="mt-4 border-t border-neutral-800 pt-4 text-sm">
            <p>
              <span className="text-neutral-400">Balance: </span>
              {eth !== undefined ? `${eth.toFixed(4)} ETH` : "loading..."}
            </p>
            <p>
              <span className="text-neutral-400">Value: </span>
              {usd !== undefined
                ? `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "loading..."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}