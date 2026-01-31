import type { WalletSelector } from "@near-wallet-selector/core";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupSender } from "@near-wallet-selector/sender";

const NETWORK = (import.meta.env.VITE_NEAR_NETWORK as "mainnet" | "testnet") || "testnet";

let selectorInstance: WalletSelector | null = null;
let modalInstance: WalletSelectorModal | null = null;

export async function initNearWallet(): Promise<{
  selector: WalletSelector;
  modal: WalletSelectorModal;
}> {
  if (selectorInstance && modalInstance) {
    return { selector: selectorInstance, modal: modalInstance };
  }

  const selector = await setupWalletSelector({
    network: NETWORK,
    modules: [setupMeteorWallet(), setupSender()],
  });

  const modal = setupModal(selector, {
    theme: "auto",
    description: "Connect your NEAR wallet to use Vestra",
  });

  selectorInstance = selector;
  modalInstance = modal;
  return { selector, modal };
}

export { NETWORK };
