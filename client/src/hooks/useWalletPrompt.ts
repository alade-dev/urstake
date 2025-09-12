import { useState, useEffect, useRef } from "react";
import { useWallet } from "./useWallet";

export const useWalletPrompt = () => {
  const { connected } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  // Watch for connection changes when modal is open
  useEffect(() => {
    if (connected && isModalOpen && resolveRef.current) {
      resolveRef.current(true);
      setIsModalOpen(false);
      resolveRef.current = null;
    }
  }, [connected, isModalOpen]);

  const promptConnection = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (connected) {
        resolve(true);
        return;
      }

      setIsModalOpen(true);
      resolveRef.current = resolve;

      // Clean up after 30 seconds
      setTimeout(() => {
        if (resolveRef.current === resolve) {
          setIsModalOpen(false);
          resolveRef.current = null;
          resolve(false);
        }
      }, 30000);
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  };

  return {
    isModalOpen,
    closeModal,
    promptConnection,
  };
};
