import { useEffect } from "react";

type ToastStatus = "success" | "error" | "loading";

interface TransactionToastProps {
  hash?: string;
  message?: string;
  status?: ToastStatus;
  onClose: () => void;
}

const TransactionToast = ({
  hash,
  message,
  status = "success",
  onClose
}: TransactionToastProps) => {
  const link = hash ? `https://stellar.expert/explorer/testnet/tx/${hash}` : "";

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const statusStyle =
    status === "success"
      ? "border-l-success"
      : status === "error"
        ? "border-l-error"
        : "border-l-ember";

  const title =
    status === "success" ? "Transaction confirmed" : status === "error" ? "Transaction failed" : "Sending to Stellar...";

  return (
    <div className={`fixed bottom-5 right-5 z-50 w-[360px] rounded-xl border border-warmgray/40 border-l-4 bg-wood p-4 shadow-[0_25px_70px_rgba(58,36,24,0.45)] ${statusStyle}`}>
      <p className="text-sm font-semibold text-cream">{title}</p>
      {message && <p className="mt-2 text-xs text-cream/75">{message}</p>}
      {hash && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mono mt-2 block break-all text-xs text-amber underline"
        >
          {hash}
        </a>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-3 rounded-lg bg-cream/15 px-3 py-1 text-xs font-semibold text-cream transition hover:bg-cream/25"
      >
        Dismiss
      </button>
    </div>
  );
};

export default TransactionToast;
