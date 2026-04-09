import { create } from 'zustand';
import type { User, MannerScore } from '@/shared';

interface ProfileState {
  profile: User | null;
  mannerScore: MannerScore | null;
  isLoading: boolean;
  setProfile: (profile: User) => void;
  setMannerScore: (score: MannerScore) => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  mannerScore: null,
  isLoading: false,

  setProfile: (profile) => set({ profile }),
  setMannerScore: (score) => set({ mannerScore: score }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
}));
