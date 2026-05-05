import { useState, useEffect, useCallback } from 'react';
import { rewardsRepository, Wallet } from '../repositories/rewardsRepository';
import { levelForXp } from '../services/rewardService';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>({ xpTotal: 0, coinsTotal: 0, chestsOpened: 0, level: 1 });
  const [levelInfo, setLevelInfo] = useState({ level: 1, xpIntoLevel: 0, xpForNext: 50 });

  const refresh = useCallback(() => {
    const w = rewardsRepository.get();
    setWallet(w);
    setLevelInfo(levelForXp(w.xpTotal));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { wallet, levelInfo, refresh };
}
