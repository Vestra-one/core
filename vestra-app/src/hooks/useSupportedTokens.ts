import { useQuery } from "@tanstack/react-query";
import { OneClickService, type TokenResponse } from "../lib/intents";

/** Chain label for UI (blockchain id from API mapped to display name). */
export const CHAIN_LABELS: Record<string, string> = {
  near: "NEAR",
  eth: "Ethereum",
  arb: "Arbitrum",
  base: "Base",
  sol: "Solana",
  pol: "Polygon",
  op: "Optimism",
  bsc: "BNB Chain",
  avax: "Avalanche",
  ton: "TON",
  btc: "Bitcoin",
  doge: "Dogecoin",
  ltc: "Litecoin",
  tron: "TRON",
  sui: "Sui",
  gnosis: "Gnosis",
  xlayer: "X Layer",
  monad: "Monad",
  starknet: "Starknet",
  cardano: "Cardano",
  xrp: "XRP",
  zec: "ZCash",
  bera: "Berachain",
  bch: "Bitcoin Cash",
  adi: "ADI",
};

export type ChainOption = {
  id: string;
  label: string;
  tokens: TokenResponse[];
};

function groupTokensByChain(tokens: TokenResponse[]): ChainOption[] {
  const byChain = new Map<string, TokenResponse[]>();
  for (const t of tokens) {
    const chain = t.blockchain ?? "near";
    if (!byChain.has(chain)) byChain.set(chain, []);
    byChain.get(chain)!.push(t);
  }
  const result: ChainOption[] = [];
  byChain.forEach((chainTokens, id) => {
    result.push({
      id,
      label: CHAIN_LABELS[id] ?? id,
      tokens: chainTokens.sort((a, b) => a.symbol.localeCompare(b.symbol)),
    });
  });
  return result.sort((a, b) => a.label.localeCompare(b.label));
}

const TOKENS_QUERY_KEY = ["intents", "tokens"] as const;

export function useSupportedTokens(): {
  chains: ChainOption[];
  tokens: TokenResponse[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data: tokens = [], isLoading, error } = useQuery({
    queryKey: TOKENS_QUERY_KEY,
    queryFn: () => OneClickService.getTokens(),
    staleTime: 5 * 60 * 1000,
  });
  const chains = groupTokensByChain(tokens);
  return { chains, tokens, isLoading, error: error as Error | null };
}

/** Find destination asset ID for a chain and optional symbol (e.g. USDC). */
export function getDestinationAssetId(
  tokens: TokenResponse[],
  chainId: string,
  symbol?: string,
): string | null {
  const chainTokens = tokens.filter((t) => (t.blockchain ?? "near") === chainId);
  if (chainTokens.length === 0) return null;
  if (symbol) {
    const match = chainTokens.find(
      (t) => t.symbol.toUpperCase() === symbol.toUpperCase(),
    );
    return match?.assetId ?? chainTokens[0]?.assetId ?? null;
  }
  return chainTokens[0]?.assetId ?? null;
}
