import { create } from 'zustand';
import type { Match } from '@/shared';

interface MatchState {
  pendingMatches: Match[];
  activeMatch: Match | null;
  setPendingMatches: (matches: Match[]) => void;
  addPendingMatch: (match: Match) => void;
  removePendingMatch: (id: string) => void;
  setActiveMatch: (match: Match | null) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  pendingMatches: [],
  activeMatch: null,

  setPendingMatches: (matches) => set({ pendingMatches: matches }),
  addPendingMatch: (match) =>
    set((state) => ({ pendingMatches: [match, ...state.pendingMatches] })),
  removePendingMatch: (id) =>
    set((state) => ({ pendingMatches: state.pendingMatches.filter((m) => m.id !== id) })),
  setActiveMatch: (match) => set({ activeMatch: match }),
}));
