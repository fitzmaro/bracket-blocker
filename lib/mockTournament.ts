/**
 * Mock NCAA Tournament data for 2026
 * Real bracket structure with realistic teams
 */

export type TournamentGame = {
  id: string;
  round: string;
  region: string;
  team1: { name: string; seed: number; abbreviation: string };
  team2: { name: string; seed: number; abbreviation: string };
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'final';
  score?: { team1: number; team2: number };
};

// 2026 Tournament bracket (mock data)
export const TOURNAMENT_2026: TournamentGame[] = [
  // ==================== EAST REGION ====================
  // Round of 64 - March 20-21
  { id: 'e1', round: 'Round of 64', region: 'East', team1: { name: 'Duke', seed: 1, abbreviation: 'DUKE' }, team2: { name: 'Montana State', seed: 16, abbreviation: 'MTST' }, date: 'Thursday, March 19', time: '12:15 PM ET', location: 'Brooklyn, NY', status: 'scheduled' },
  { id: 'e2', round: 'Round of 64', region: 'East', team1: { name: 'Wisconsin', seed: 8, abbreviation: 'WIS' }, team2: { name: 'Pittsburgh', seed: 9, abbreviation: 'PITT' }, date: 'Thursday, March 19', time: '2:45 PM ET', location: 'Brooklyn, NY', status: 'scheduled' },
  { id: 'e3', round: 'Round of 64', region: 'East', team1: { name: 'Kentucky', seed: 5, abbreviation: 'UK' }, team2: { name: 'Troy', seed: 12, abbreviation: 'TROY' }, date: 'Thursday, March 19', time: '6:50 PM ET', location: 'Brooklyn, NY', status: 'scheduled' },
  { id: 'e4', round: 'Round of 64', region: 'East', team1: { name: 'Arizona', seed: 4, abbreviation: 'ARIZ' }, team2: { name: 'Long Beach State', seed: 13, abbreviation: 'LBSU' }, date: 'Thursday, March 19', time: '9:20 PM ET', location: 'Brooklyn, NY', status: 'scheduled' },
  { id: 'e5', round: 'Round of 64', region: 'East', team1: { name: 'Purdue', seed: 6, abbreviation: 'PUR' }, team2: { name: 'Colgate', seed: 11, abbreviation: 'COLG' }, date: 'Friday, March 20', time: '12:15 PM ET', location: 'Raleigh, NC', status: 'scheduled' },
  { id: 'e6', round: 'Round of 64', region: 'East', team1: { name: 'Texas Tech', seed: 3, abbreviation: 'TTU' }, team2: { name: 'Northern Kentucky', seed: 14, abbreviation: 'NKU' }, date: 'Friday, March 20', time: '2:45 PM ET', location: 'Raleigh, NC', status: 'scheduled' },
  { id: 'e7', round: 'Round of 64', region: 'East', team1: { name: 'Florida', seed: 7, abbreviation: 'FLA' }, team2: { name: 'Nevada', seed: 10, abbreviation: 'NEV' }, date: 'Friday, March 20', time: '6:50 PM ET', location: 'Raleigh, NC', status: 'scheduled' },
  { id: 'e8', round: 'Round of 64', region: 'East', team1: { name: 'Alabama', seed: 2, abbreviation: 'ALA' }, team2: { name: 'Howard', seed: 15, abbreviation: 'HOW' }, date: 'Friday, March 20', time: '9:20 PM ET', location: 'Raleigh, NC', status: 'scheduled' },

  // ==================== WEST REGION ====================
  { id: 'w1', round: 'Round of 64', region: 'West', team1: { name: 'Houston', seed: 1, abbreviation: 'HOU' }, team2: { name: 'Texas Southern', seed: 16, abbreviation: 'TXSO' }, date: 'Thursday, March 19', time: '1:00 PM ET', location: 'Memphis, TN', status: 'scheduled' },
  { id: 'w2', round: 'Round of 64', region: 'West', team1: { name: 'San Diego State', seed: 8, abbreviation: 'SDSU' }, team2: { name: 'UAB', seed: 9, abbreviation: 'UAB' }, date: 'Thursday, March 19', time: '3:30 PM ET', location: 'Memphis, TN', status: 'scheduled' },
  { id: 'w3', round: 'Round of 64', region: 'West', team1: { name: 'Marquette', seed: 5, abbreviation: 'MARQ' }, team2: { name: 'Vermont', seed: 12, abbreviation: 'UVM' }, date: 'Thursday, March 19', time: '7:10 PM ET', location: 'Memphis, TN', status: 'scheduled' },
  { id: 'w4', round: 'Round of 64', region: 'West', team1: { name: 'Kansas', seed: 4, abbreviation: 'KU' }, team2: { name: 'Samford', seed: 13, abbreviation: 'SAM' }, date: 'Thursday, March 19', time: '9:40 PM ET', location: 'Memphis, TN', status: 'scheduled' },
  { id: 'w5', round: 'Round of 64', region: 'West', team1: { name: 'Creighton', seed: 6, abbreviation: 'CREI' }, team2: { name: 'Akron', seed: 11, abbreviation: 'AKR' }, date: 'Friday, March 20', time: '1:00 PM ET', location: 'Salt Lake City, UT', status: 'scheduled' },
  { id: 'w6', round: 'Round of 64', region: 'West', team1: { name: 'Gonzaga', seed: 3, abbreviation: 'GONZ' }, team2: { name: 'McNeese State', seed: 14, abbreviation: 'MCN' }, date: 'Friday, March 20', time: '3:30 PM ET', location: 'Salt Lake City, UT', status: 'scheduled' },
  { id: 'w7', round: 'Round of 64', region: 'West', team1: { name: 'Texas A&M', seed: 7, abbreviation: 'TAMU' }, team2: { name: 'Nebraska', seed: 10, abbreviation: 'NEB' }, date: 'Friday, March 20', time: '7:10 PM ET', location: 'Salt Lake City, UT', status: 'scheduled' },
  { id: 'w8', round: 'Round of 64', region: 'West', team1: { name: 'Tennessee', seed: 2, abbreviation: 'TENN' }, team2: { name: 'Wagner', seed: 15, abbreviation: 'WAG' }, date: 'Friday, March 20', time: '9:40 PM ET', location: 'Salt Lake City, UT', status: 'scheduled' },

  // ==================== SOUTH REGION ====================
  { id: 's1', round: 'Round of 64', region: 'South', team1: { name: 'UConn', seed: 1, abbreviation: 'CONN' }, team2: { name: 'Stetson', seed: 16, abbreviation: 'STET' }, date: 'Thursday, March 19', time: '12:40 PM ET', location: 'Indianapolis, IN', status: 'scheduled' },
  { id: 's2', round: 'Round of 64', region: 'South', team1: { name: 'Northwestern', seed: 8, abbreviation: 'NW' }, team2: { name: 'Florida Atlantic', seed: 9, abbreviation: 'FAU' }, date: 'Thursday, March 19', time: '3:10 PM ET', location: 'Indianapolis, IN', status: 'scheduled' },
  { id: 's3', round: 'Round of 64', region: 'South', team1: { name: 'Iowa State', seed: 5, abbreviation: 'ISU' }, team2: { name: 'South Dakota State', seed: 12, abbreviation: 'SDST' }, date: 'Thursday, March 19', time: '7:25 PM ET', location: 'Indianapolis, IN', status: 'scheduled' },
  { id: 's4', round: 'Round of 64', region: 'South', team1: { name: 'Auburn', seed: 4, abbreviation: 'AUB' }, team2: { name: 'Yale', seed: 13, abbreviation: 'YALE' }, date: 'Thursday, March 19', time: '9:55 PM ET', location: 'Indianapolis, IN', status: 'scheduled' },
  { id: 's5', round: 'Round of 64', region: 'South', team1: { name: 'BYU', seed: 6, abbreviation: 'BYU' }, team2: { name: 'Duquesne', seed: 11, abbreviation: 'DUQ' }, date: 'Friday, March 20', time: '12:40 PM ET', location: 'Omaha, NE', status: 'scheduled' },
  { id: 's6', round: 'Round of 64', region: 'South', team1: { name: 'Illinois', seed: 3, abbreviation: 'ILL' }, team2: { name: 'Morehead State', seed: 14, abbreviation: 'MORE' }, date: 'Friday, March 20', time: '3:10 PM ET', location: 'Omaha, NE', status: 'scheduled' },
  { id: 's7', round: 'Round of 64', region: 'South', team1: { name: 'Washington State', seed: 7, abbreviation: 'WSU' }, team2: { name: 'Drake', seed: 10, abbreviation: 'DRKE' }, date: 'Friday, March 20', time: '7:25 PM ET', location: 'Omaha, NE', status: 'scheduled' },
  { id: 's8', round: 'Round of 64', region: 'South', team1: { name: 'North Carolina', seed: 2, abbreviation: 'UNC' }, team2: { name: 'Longwood', seed: 15, abbreviation: 'LONG' }, date: 'Friday, March 20', time: '9:55 PM ET', location: 'Omaha, NE', status: 'scheduled' },

  // ==================== MIDWEST REGION ====================
  { id: 'm1', round: 'Round of 64', region: 'Midwest', team1: { name: 'Kansas State', seed: 1, abbreviation: 'KSU' }, team2: { name: 'Grambling', seed: 16, abbreviation: 'GRAM' }, date: 'Thursday, March 19', time: '2:00 PM ET', location: 'Charlotte, NC', status: 'scheduled' },
  { id: 'm2', round: 'Round of 64', region: 'Midwest', team1: { name: 'Utah State', seed: 8, abbreviation: 'USU' }, team2: { name: 'TCU', seed: 9, abbreviation: 'TCU' }, date: 'Thursday, March 19', time: '4:30 PM ET', location: 'Charlotte, NC', status: 'scheduled' },
  { id: 'm3', round: 'Round of 64', region: 'Midwest', team1: { name: 'Clemson', seed: 5, abbreviation: 'CLEM' }, team2: { name: 'New Mexico', seed: 12, abbreviation: 'UNM' }, date: 'Thursday, March 19', time: '7:55 PM ET', location: 'Charlotte, NC', status: 'scheduled' },
  { id: 'm4', round: 'Round of 64', region: 'Midwest', team1: { name: 'Baylor', seed: 4, abbreviation: 'BAY' }, team2: { name: 'Colgate', seed: 13, abbreviation: 'COLG' }, date: 'Thursday, March 19', time: '10:25 PM ET', location: 'Charlotte, NC', status: 'scheduled' },
  { id: 'm5', round: 'Round of 64', region: 'Midwest', team1: { name: 'Michigan State', seed: 6, abbreviation: 'MSU' }, team2: { name: 'James Madison', seed: 11, abbreviation: 'JMU' }, date: 'Friday, March 20', time: '2:00 PM ET', location: 'Spokane, WA', status: 'scheduled' },
  { id: 'm6', round: 'Round of 64', region: 'Midwest', team1: { name: 'St. John\'s', seed: 3, abbreviation: 'SJU' }, team2: { name: 'Grand Canyon', seed: 14, abbreviation: 'GCU' }, date: 'Friday, March 20', time: '4:30 PM ET', location: 'Spokane, WA', status: 'scheduled' },
  { id: 'm7', round: 'Round of 64', region: 'Midwest', team1: { name: 'Missouri', seed: 7, abbreviation: 'MIZ' }, team2: { name: 'Oregon', seed: 10, abbreviation: 'ORE' }, date: 'Friday, March 20', time: '7:55 PM ET', location: 'Spokane, WA', status: 'scheduled' },
  { id: 'm8', round: 'Round of 64', region: 'Midwest', team1: { name: 'UCLA', seed: 2, abbreviation: 'UCLA' }, team2: { name: 'Cleveland State', seed: 15, abbreviation: 'CSU' }, date: 'Friday, March 20', time: '10:25 PM ET', location: 'Spokane, WA', status: 'scheduled' },

  // ==================== ROUND OF 32 (TBD - depends on Round of 64 results) ====================
  // East
  { id: 'e32-1', round: 'Round of 32', region: 'East', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '12:10 PM ET', location: 'Brooklyn, NY', status: 'scheduled' },
  { id: 'e32-2', round: 'Round of 32', region: 'East', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '2:40 PM ET', location: 'Brooklyn, NY', status: 'scheduled' },
  { id: 'e32-3', round: 'Round of 32', region: 'East', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '5:15 PM ET', location: 'Raleigh, NC', status: 'scheduled' },
  { id: 'e32-4', round: 'Round of 32', region: 'East', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '7:45 PM ET', location: 'Raleigh, NC', status: 'scheduled' },
  // West
  { id: 'w32-1', round: 'Round of 32', region: 'West', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '5:15 PM ET', location: 'Memphis, TN', status: 'scheduled' },
  { id: 'w32-2', round: 'Round of 32', region: 'West', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '7:45 PM ET', location: 'Memphis, TN', status: 'scheduled' },
  { id: 'w32-3', round: 'Round of 32', region: 'West', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '12:10 PM ET', location: 'Salt Lake City, UT', status: 'scheduled' },
  { id: 'w32-4', round: 'Round of 32', region: 'West', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '2:40 PM ET', location: 'Salt Lake City, UT', status: 'scheduled' },
  // South
  { id: 's32-1', round: 'Round of 32', region: 'South', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '6:10 PM ET', location: 'Indianapolis, IN', status: 'scheduled' },
  { id: 's32-2', round: 'Round of 32', region: 'South', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '8:40 PM ET', location: 'Indianapolis, IN', status: 'scheduled' },
  { id: 's32-3', round: 'Round of 32', region: 'South', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '6:10 PM ET', location: 'Omaha, NE', status: 'scheduled' },
  { id: 's32-4', round: 'Round of 32', region: 'South', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '8:40 PM ET', location: 'Omaha, NE', status: 'scheduled' },
  // Midwest
  { id: 'm32-1', round: 'Round of 32', region: 'Midwest', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '1:00 PM ET', location: 'Charlotte, NC', status: 'scheduled' },
  { id: 'm32-2', round: 'Round of 32', region: 'Midwest', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 21', time: '3:30 PM ET', location: 'Charlotte, NC', status: 'scheduled' },
  { id: 'm32-3', round: 'Round of 32', region: 'Midwest', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '1:00 PM ET', location: 'Spokane, WA', status: 'scheduled' },
  { id: 'm32-4', round: 'Round of 32', region: 'Midwest', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 22', time: '3:30 PM ET', location: 'Spokane, WA', status: 'scheduled' },

  // ==================== SWEET 16 (TBD) ====================
  { id: 'e16-1', round: 'Sweet 16', region: 'East', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Thursday, March 26', time: '7:09 PM ET', location: 'Boston, MA', status: 'scheduled' },
  { id: 'e16-2', round: 'Sweet 16', region: 'East', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Thursday, March 26', time: '9:39 PM ET', location: 'Boston, MA', status: 'scheduled' },
  { id: 'w16-1', round: 'Sweet 16', region: 'West', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Friday, March 27', time: '7:09 PM ET', location: 'Los Angeles, CA', status: 'scheduled' },
  { id: 'w16-2', round: 'Sweet 16', region: 'West', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Friday, March 27', time: '9:39 PM ET', location: 'Los Angeles, CA', status: 'scheduled' },
  { id: 's16-1', round: 'Sweet 16', region: 'South', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Thursday, March 26', time: '6:30 PM ET', location: 'Dallas, TX', status: 'scheduled' },
  { id: 's16-2', round: 'Sweet 16', region: 'South', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Thursday, March 26', time: '9:00 PM ET', location: 'Dallas, TX', status: 'scheduled' },
  { id: 'm16-1', round: 'Sweet 16', region: 'Midwest', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Friday, March 27', time: '6:30 PM ET', location: 'Detroit, MI', status: 'scheduled' },
  { id: 'm16-2', round: 'Sweet 16', region: 'Midwest', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Friday, March 27', time: '9:00 PM ET', location: 'Detroit, MI', status: 'scheduled' },

  // ==================== ELITE 8 (TBD) ====================
  { id: 'e8-e', round: 'Elite 8', region: 'East', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 28', time: '6:09 PM ET', location: 'Boston, MA', status: 'scheduled' },
  { id: 'e8-w', round: 'Elite 8', region: 'West', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 29', time: '2:20 PM ET', location: 'Los Angeles, CA', status: 'scheduled' },
  { id: 'e8-s', round: 'Elite 8', region: 'South', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, March 28', time: '8:49 PM ET', location: 'Dallas, TX', status: 'scheduled' },
  { id: 'e8-m', round: 'Elite 8', region: 'Midwest', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Sunday, March 29', time: '5:05 PM ET', location: 'Detroit, MI', status: 'scheduled' },

  // ==================== FINAL FOUR (TBD) ====================
  { id: 'ff-1', round: 'Final Four', region: 'National', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, April 4', time: '6:09 PM ET', location: 'San Antonio, TX', status: 'scheduled' },
  { id: 'ff-2', round: 'Final Four', region: 'National', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Saturday, April 4', time: '8:49 PM ET', location: 'San Antonio, TX', status: 'scheduled' },

  // ==================== CHAMPIONSHIP (TBD) ====================
  { id: 'chip', round: 'Championship', region: 'National', team1: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, team2: { name: 'TBD', seed: 0, abbreviation: 'TBD' }, date: 'Monday, April 6', time: '9:20 PM ET', location: 'San Antonio, TX', status: 'scheduled' },
];

export function getTournamentGames(): TournamentGame[] {
  return TOURNAMENT_2026;
}
