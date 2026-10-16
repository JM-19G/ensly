import { ConnectButton } from "@rainbow-me/rainbowkit";
import EnsLookup from "@/components/EnsLookup";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ensly</h1>
        <ConnectButton />
      </header>
      <EnsLookup />
    </main>
  );
}