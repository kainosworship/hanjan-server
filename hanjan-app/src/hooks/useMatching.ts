import { apiGet, apiPost } from '@/services/apiClient';
import { useMatchStore } from '@/stores/matchStore';
import type { Match } from '@/shared';

export function useMatching() {
  const { pendingMatches, setPendingMatches, removePendingMatch, setActiveMatch } = useMatchStore();

  const fetchPending = async (): Promise<Match[]> => {
    const matches = await apiGet<Match[]>('/matching/pending');
    setPendingMatches(matches);
    return matches;
  };

  const requestMatch = async (activityId: string): Promise<Match> => {
    return apiPost<Match>(`/matching/${activityId}/request`);
  };

  const acceptMatch = async (matchId: string): Promise<Match> => {
    const match = await apiPost<Match>(`/matching/${matchId}/accept`);
    removePendingMatch(matchId);
    setActiveMatch(match);
    return match;
  };

  const rejectMatch = async (matchId: string): Promise<void> => {
    await apiPost(`/matching/${matchId}/reject`);
    removePendingMatch(matchId);
  };

  return { pendingMatches, fetchPending, requestMatch, acceptMatch, rejectMatch };
}
