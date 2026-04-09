import { apiGet, apiPost, apiPatch } from '@/services/apiClient';
import { useActivityStore } from '@/stores/activityStore';
import type { Activity, ActivityCard, CreateActivityDto, NearbyActivitiesQuery } from 'hanjan-shared';

export function useActivities() {
  const { nearbyActivities, myActivities, setNearbyActivities, setMyActivities, addActivity } = useActivityStore();

  const fetchNearby = async (query: NearbyActivitiesQuery): Promise<ActivityCard[]> => {
    const params: Record<string, string | number> = {
      lat: query.lat,
      lng: query.lng,
    };
    if (query.radiusKm !== undefined) params['radiusKm'] = query.radiusKm;
    if (query.category !== undefined) params['category'] = query.category;
    if (query.groupSize !== undefined) params['groupSize'] = query.groupSize;
    const activities = await apiGet<ActivityCard[]>('/activities/nearby', params);
    setNearbyActivities(activities);
    return activities;
  };

  const fetchMy = async (): Promise<Activity[]> => {
    const activities = await apiGet<Activity[]>('/activities/my');
    setMyActivities(activities);
    return activities;
  };

  const createActivity = async (dto: CreateActivityDto): Promise<Activity> => {
    const activity = await apiPost<Activity>('/activities', dto);
    addActivity(activity);
    return activity;
  };

  const cancelActivity = async (id: string): Promise<void> => {
    await apiPatch(`/activities/${id}/cancel`);
  };

  const getDailyCount = async (): Promise<{ count: number; limit: number }> => {
    return apiGet<{ count: number; limit: number }>('/activities/daily-count');
  };

  return { nearbyActivities, myActivities, fetchNearby, fetchMy, createActivity, cancelActivity, getDailyCount };
}
