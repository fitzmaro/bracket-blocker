/**
 * Ball Don't Lie API Integration
 * NCAAB (NCAA Men's Basketball) endpoints
 * Docs: https://ncaab.balldontlie.io
 */

const BASE_URL = 'https://api.balldontlie.io/ncaab/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY;

type FetchOptions = {
  params?: Record<string, string | number | undefined>;
};

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);

  // Add query params
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': API_KEY || '',
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/* ==========================================
   TYPES
   ========================================== */

export type Conference = {
  id: number;
  name: string;
  abbreviation: string;
};

export type Team = {
  id: number;
  name: string;
  abbreviation: string;
  conference_id: number;
  conference: Conference;
};

export type Game = {
  id: number;
  date: string; // ISO date string
  season: number;
  status: 'scheduled' | 'in_progress' | 'final';
  home_team: Team;
  home_team_score: number;
  visitor_team: Team;
  visitor_team_score: number;
  // Tournament-specific fields (if available)
  postseason?: boolean;
  round?: string;
};

export type Ranking = {
  team: Team;
  rank: number;
  season: number;
  week: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    next_cursor?: number;
    per_page: number;
  };
};

/* ==========================================
   API FUNCTIONS
   ========================================== */

/**
 * Get all conferences
 */
export async function getConferences(): Promise<Conference[]> {
  const response = await fetchAPI<PaginatedResponse<Conference>>('/conferences');
  return response.data;
}

/**
 * Get all teams, optionally filtered by conference
 */
export async function getTeams(conferenceId?: number): Promise<Team[]> {
  const response = await fetchAPI<PaginatedResponse<Team>>('/teams', {
    params: { conference_id: conferenceId },
  });
  return response.data;
}

/**
 * Get games with filters
 */
export async function getGames(options: {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
  teamIds?: number[];
  season?: number;
  postseason?: boolean;
}): Promise<Game[]> {
  const response = await fetchAPI<PaginatedResponse<Game>>('/games', {
    params: {
      start_date: options.startDate,
      end_date: options.endDate,
      team_ids: options.teamIds?.join(','),
      seasons: options.season,
      postseason: options.postseason ? 'true' : undefined,
    },
  });
  return response.data;
}

/**
 * Get a specific game by ID
 */
export async function getGame(gameId: number): Promise<Game> {
  const response = await fetchAPI<{ data: Game }>(`/games/${gameId}`);
  return response.data;
}

/**
 * Get rankings for a specific week
 */
export async function getRankings(season: number, week?: number): Promise<Ranking[]> {
  const response = await fetchAPI<PaginatedResponse<Ranking>>('/rankings', {
    params: { season, week },
  });
  return response.data;
}

/**
 * Get March Madness tournament games
 * Tournament typically runs mid-March through early April
 */
export async function getTournamentGames(season: number): Promise<Game[]> {
  // March Madness dates for the given season
  // First Four: ~March 19-20
  // Round of 64: ~March 21-22
  // Round of 32: ~March 23-24
  // Sweet 16: ~March 27-28
  // Elite 8: ~March 29-30
  // Final Four: First Saturday in April
  // Championship: First Monday in April

  return getGames({
    season,
    startDate: `${season}-03-15`, // Start of tournament
    endDate: `${season}-04-10`,   // After championship
    postseason: true,
  });
}

/**
 * Helper to format game date/time for display
 */
export function formatGameDateTime(game: Game): { date: string; time: string } {
  const gameDate = new Date(game.date);

  const date = gameDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const time = gameDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return { date, time };
}

/**
 * Helper to determine tournament round from date
 * This is approximate - actual round data may be in API response
 */
export function inferTournamentRound(gameDate: string): string {
  const date = new Date(gameDate);
  const month = date.getMonth() + 1; // 0-indexed
  const day = date.getDate();

  if (month === 3) {
    if (day <= 20) return 'First Four';
    if (day <= 22) return 'Round of 64';
    if (day <= 24) return 'Round of 32';
    if (day <= 28) return 'Sweet 16';
    if (day <= 30) return 'Elite 8';
  }
  if (month === 4) {
    if (day <= 5) return 'Final Four';
    if (day <= 7) return 'Championship';
  }

  return 'Tournament';
}
