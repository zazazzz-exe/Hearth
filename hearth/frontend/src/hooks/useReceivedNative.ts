import { useQuery } from "@tanstack/react-query";
import { sorobanService } from "../services/SorobanService";

export const useReceivedNative = (publicKey: string | null) =>
  useQuery({
    queryKey: ["received-native", publicKey],
    queryFn: () => (publicKey ? sorobanService.getReceivedNativeTotal(publicKey) : 0),
    enabled: Boolean(publicKey),
    refetchInterval: 15_000,
    staleTime: 5_000
  });
