'use server';

import { getLiveCricketScores, getCricketStats, getMatchDetails } from '../cricket';

export async function refreshCricketScoresAction() {
  try {
    const [scores, stats] = await Promise.all([
      getLiveCricketScores(),
      getCricketStats()
    ]);
    return { 
      success: true, 
      data: { 
        matches: scores,
        stats: stats
      } 
    };
  } catch (error) {
    console.error('[SportsAction] Refresh failed:', error);
    return { success: false, error: 'Failed to refresh sports data' };
  }
}

export async function getMatchDetailsAction(matchId: string) {
  try {
    const details = await getMatchDetails(matchId);
    return { success: true, data: details };
  } catch (error) {
    console.error('[SportsAction] Match details fetch failed:', error);
    return { success: false, data: null };
  }
}
