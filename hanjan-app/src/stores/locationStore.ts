import { create } from 'zustand';

interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  hasPermission: boolean;
  isLoading: boolean;
  setLocation: (lat: number, lng: number, accuracy?: number) => void;
  setPermission: (granted: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lng: null,
  accuracy: null,
  hasPermission: false,
  isLoading: false,

  setLocation: (lat, lng, accuracy) => set({ lat, lng, accuracy }),
  setPermission: (granted) => set({ hasPermission: granted }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
