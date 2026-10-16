"use client";

import { useState } from "react";
import { useEnsAddress } from "wagmi";
import { normalize } from "viem/ens";
import { mainnet } from "wagmi/chains";

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

  const { data: address, isLoading } = useEnsAddress({
    name,
    chainId: mainnet.id,
    query: { enabled: !!name },
  });

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

      <div className="mt-4 break-all text-sm text-neutral-300">
        {isLoading && "Resolving..."}
        {name && !isLoading && (address ? address : "No address found for this name")}
      </div>
    </section>
  );
}