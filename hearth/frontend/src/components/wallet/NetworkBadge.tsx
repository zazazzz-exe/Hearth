interface NetworkBadgeProps {
  network: string | null;
}

const NetworkBadge = ({ network }: NetworkBadgeProps) => {
  const normalized = (network || "").toLowerCase();
  const isTestnet = normalized.includes("test");

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.14em] ${
        isTestnet ? "bg-amber text-wood" : "bg-success text-cream"
      }`}
    >
      {isTestnet ? "TESTNET" : "MAINNET"}
    </span>
  );
};

export default NetworkBadge;
