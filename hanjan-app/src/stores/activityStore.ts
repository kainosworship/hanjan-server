import { create } from 'zustand';
import type { Activity, ActivityCard } from 'hanjan-shared';

interface ActivityState {
  nearbyActivities: ActivityCard[];
  myActivities: Activity[];
  selectedActivity: ActivityCard | null;
  isLoading: boolean;
  setNearbyActivities: (activities: ActivityCard[]) => void;
  setMyActivities: (activities: Activity[]) => void;
  selectActivity: (activity: ActivityCard | null) => void;
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  nearbyActivities: [],
  myActivities: [],
  selectedActivity: null,
  isLoading: false,

  setNearbyActivities: (activities) => set({ nearbyActivities: activities }),
  setMyActivities: (activities) => set({ myActivities: activities }),
  selectActivity: (activity) => set({ selectedActivity: activity }),
  addActivity: (activity) =>
    set((state) => ({ myActivities: [activity, ...state.myActivities] })),
  removeActivity: (id) =>
    set((state) => ({
      myActivities: state.myActivities.filter((a) => a.id !== id),
      nearbyActivities: state.nearbyActivities.filter((a) => a.id !== id),
    })),
}));
