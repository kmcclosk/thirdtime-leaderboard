import { LeaderboardRange, LeaderboardView } from "../types";

// Map the range display name to the view internal value
export const leaderboardRangeToViewMap: { [Key in LeaderboardRange as string]: LeaderboardView; } = {
  'Top 100': 'hundred',
  'Global': 'global',
};

export const leaderboardViewToRangeMap: { [Key in LeaderboardView as string]: LeaderboardRange; } = {
  'hundred': 'Top 100',
  'global': 'Global',
};

export const defaultEvents = [
  'KentuckyDerby',
  'PreaknessStakes',
  'BreedersCup',
  'GrandNational',
  '00Invalid',
];
