import type { Team } from '../types'

const injury = (
  player: string,
  role: string,
  severity: 'minor' | 'moderate' | 'major',
  impact: number
) => ({ player, role, severity, impact })

export const TEAMS: Record<string, Team> = {
  MEX: { id: 'MEX', name: 'Mexico', flag: '🇲🇽', confederation: 'CONCACAF', group: 'A', fifaRank: 14, historical: { worldCupTitles: 0, bestFinish: 'QF (1970, 1986)', appearances: 18, avgGroupPoints: 4.2, knockoutRate: 0.35 }, current: { formScore: 72, attackRating: 74, defenseRating: 70, squadDepth: 68 }, injuries: [injury('H. Lozano', 'LW', 'minor', 0.03)] },
  RSA: { id: 'RSA', name: 'South Africa', flag: '🇿🇦', confederation: 'CAF', group: 'A', fifaRank: 59, historical: { worldCupTitles: 0, bestFinish: 'Group (2010)', appearances: 4, avgGroupPoints: 2.5, knockoutRate: 0 }, current: { formScore: 58, attackRating: 55, defenseRating: 62, squadDepth: 52 }, injuries: [] },
  KOR: { id: 'KOR', name: 'South Korea', flag: '🇰🇷', confederation: 'AFC', group: 'A', fifaRank: 23, historical: { worldCupTitles: 0, bestFinish: 'SF (2002)', appearances: 12, avgGroupPoints: 3.8, knockoutRate: 0.25 }, current: { formScore: 68, attackRating: 70, defenseRating: 66, squadDepth: 64 }, injuries: [injury('Son Heung-min', 'LW', 'minor', 0.04)] },
  CZE: { id: 'CZE', name: 'Czechia', flag: '🇨🇿', confederation: 'UEFA', group: 'A', fifaRank: 31, historical: { worldCupTitles: 0, bestFinish: 'Runners-up (1934, 1962)', appearances: 3, avgGroupPoints: 3.0, knockoutRate: 0.33 }, current: { formScore: 65, attackRating: 64, defenseRating: 68, squadDepth: 62 }, injuries: [] },

  CAN: { id: 'CAN', name: 'Canada', flag: '🇨🇦', confederation: 'CONCACAF', group: 'B', fifaRank: 41, historical: { worldCupTitles: 0, bestFinish: 'Group (1986, 2022)', appearances: 3, avgGroupPoints: 2.0, knockoutRate: 0 }, current: { formScore: 70, attackRating: 72, defenseRating: 65, squadDepth: 60 }, injuries: [] },
  BIH: { id: 'BIH', name: 'Bosnia & Herzegovina', flag: '🇧🇦', confederation: 'UEFA', group: 'B', fifaRank: 62, historical: { worldCupTitles: 0, bestFinish: 'Group (2014)', appearances: 2, avgGroupPoints: 2.5, knockoutRate: 0 }, current: { formScore: 55, attackRating: 58, defenseRating: 54, squadDepth: 50 }, injuries: [injury('E. Džeko', 'ST', 'moderate', 0.08)] },
  QAT: { id: 'QAT', name: 'Qatar', flag: '🇶🇦', confederation: 'AFC', group: 'B', fifaRank: 35, historical: { worldCupTitles: 0, bestFinish: 'Group (2022)', appearances: 2, avgGroupPoints: 1.0, knockoutRate: 0 }, current: { formScore: 52, attackRating: 50, defenseRating: 55, squadDepth: 48 }, injuries: [] },
  SUI: { id: 'SUI', name: 'Switzerland', flag: '🇨🇭', confederation: 'UEFA', group: 'B', fifaRank: 19, historical: { worldCupTitles: 0, bestFinish: 'QF (1934, 1938, 1954)', appearances: 13, avgGroupPoints: 4.0, knockoutRate: 0.38 }, current: { formScore: 74, attackRating: 72, defenseRating: 76, squadDepth: 72 }, injuries: [] },

  BRA: { id: 'BRA', name: 'Brazil', flag: '🇧🇷', confederation: 'CONMEBOL', group: 'C', fifaRank: 5, historical: { worldCupTitles: 5, bestFinish: 'Winners', appearances: 23, avgGroupPoints: 5.5, knockoutRate: 0.78 }, current: { formScore: 82, attackRating: 85, defenseRating: 78, squadDepth: 84 }, injuries: [injury('Neymar', 'CAM', 'major', 0.12)] },
  MAR: { id: 'MAR', name: 'Morocco', flag: '🇲🇦', confederation: 'CAF', group: 'C', fifaRank: 12, historical: { worldCupTitles: 0, bestFinish: 'SF (2022)', appearances: 7, avgGroupPoints: 3.5, knockoutRate: 0.43 }, current: { formScore: 78, attackRating: 76, defenseRating: 80, squadDepth: 74 }, injuries: [] },
  HAI: { id: 'HAI', name: 'Haiti', flag: '🇭🇹', confederation: 'CONCACAF', group: 'C', fifaRank: 87, historical: { worldCupTitles: 0, bestFinish: 'Group (1974)', appearances: 2, avgGroupPoints: 1.0, knockoutRate: 0 }, current: { formScore: 45, attackRating: 44, defenseRating: 46, squadDepth: 40 }, injuries: [] },
  SCO: { id: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', group: 'C', fifaRank: 36, historical: { worldCupTitles: 0, bestFinish: 'Group (9 appearances)', appearances: 9, avgGroupPoints: 2.8, knockoutRate: 0.11 }, current: { formScore: 66, attackRating: 65, defenseRating: 68, squadDepth: 63 }, injuries: [injury('K. Tierney', 'LB', 'minor', 0.03)] },

  USA: { id: 'USA', name: 'United States', flag: '🇺🇸', confederation: 'CONCACAF', group: 'D', fifaRank: 11, historical: { worldCupTitles: 0, bestFinish: '3rd (1930)', appearances: 12, avgGroupPoints: 3.2, knockoutRate: 0.25 }, current: { formScore: 76, attackRating: 75, defenseRating: 74, squadDepth: 72 }, injuries: [injury('G. Pulisic', 'LW', 'minor', 0.02)] },
  PAR: { id: 'PAR', name: 'Paraguay', flag: '🇵🇾', confederation: 'CONMEBOL', group: 'D', fifaRank: 52, historical: { worldCupTitles: 0, bestFinish: 'QF (2010)', appearances: 9, avgGroupPoints: 3.0, knockoutRate: 0.22 }, current: { formScore: 62, attackRating: 60, defenseRating: 64, squadDepth: 58 }, injuries: [] },
  AUS: { id: 'AUS', name: 'Australia', flag: '🇦🇺', confederation: 'AFC', group: 'D', fifaRank: 24, historical: { worldCupTitles: 0, bestFinish: 'R16 (2006, 2022)', appearances: 7, avgGroupPoints: 3.0, knockoutRate: 0.29 }, current: { formScore: 67, attackRating: 66, defenseRating: 68, squadDepth: 65 }, injuries: [] },
  TUR: { id: 'TUR', name: 'Türkiye', flag: '🇹🇷', confederation: 'UEFA', group: 'D', fifaRank: 38, historical: { worldCupTitles: 0, bestFinish: '3rd (2002)', appearances: 3, avgGroupPoints: 3.5, knockoutRate: 0.33 }, current: { formScore: 64, attackRating: 68, defenseRating: 60, squadDepth: 62 }, injuries: [] },

  GER: { id: 'GER', name: 'Germany', flag: '🇩🇪', confederation: 'UEFA', group: 'E', fifaRank: 8, historical: { worldCupTitles: 4, bestFinish: 'Winners', appearances: 20, avgGroupPoints: 5.0, knockoutRate: 0.75 }, current: { formScore: 80, attackRating: 82, defenseRating: 76, squadDepth: 82 }, injuries: [injury('J. Kimmich', 'CM', 'minor', 0.03)] },
  CUW: { id: 'CUW', name: 'Curaçao', flag: '🇨🇼', confederation: 'CONCACAF', group: 'E', fifaRank: 88, historical: { worldCupTitles: 0, bestFinish: 'Debut 2026', appearances: 1, avgGroupPoints: 0, knockoutRate: 0 }, current: { formScore: 42, attackRating: 40, defenseRating: 44, squadDepth: 38 }, injuries: [] },
  CIV: { id: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', confederation: 'CAF', group: 'E', fifaRank: 33, historical: { worldCupTitles: 0, bestFinish: 'Group (3 appearances)', appearances: 4, avgGroupPoints: 2.5, knockoutRate: 0 }, current: { formScore: 68, attackRating: 70, defenseRating: 64, squadDepth: 66 }, injuries: [] },
  ECU: { id: 'ECU', name: 'Ecuador', flag: '🇪🇨', confederation: 'CONMEBOL', group: 'E', fifaRank: 27, historical: { worldCupTitles: 0, bestFinish: 'R16 (2006)', appearances: 5, avgGroupPoints: 3.2, knockoutRate: 0.2 }, current: { formScore: 70, attackRating: 68, defenseRating: 72, squadDepth: 65 }, injuries: [] },

  NED: { id: 'NED', name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA', group: 'F', fifaRank: 7, historical: { worldCupTitles: 0, bestFinish: 'Runners-up (3x)', appearances: 11, avgGroupPoints: 4.8, knockoutRate: 0.64 }, current: { formScore: 81, attackRating: 80, defenseRating: 79, squadDepth: 80 }, injuries: [injury('M. de Ligt', 'CB', 'moderate', 0.06)] },
  JPN: { id: 'JPN', name: 'Japan', flag: '🇯🇵', confederation: 'AFC', group: 'F', fifaRank: 18, historical: { worldCupTitles: 0, bestFinish: 'R16 (2002, 2010, 2022)', appearances: 8, avgGroupPoints: 4.0, knockoutRate: 0.38 }, current: { formScore: 77, attackRating: 78, defenseRating: 74, squadDepth: 73 }, injuries: [] },
  SWE: { id: 'SWE', name: 'Sweden', flag: '🇸🇪', confederation: 'UEFA', group: 'F', fifaRank: 25, historical: { worldCupTitles: 0, bestFinish: 'Runners-up (1958)', appearances: 12, avgGroupPoints: 3.5, knockoutRate: 0.33 }, current: { formScore: 69, attackRating: 70, defenseRating: 67, squadDepth: 68 }, injuries: [injury('A. Isak', 'ST', 'minor', 0.04)] },
  TUN: { id: 'TUN', name: 'Tunisia', flag: '🇹🇳', confederation: 'CAF', group: 'F', fifaRank: 47, historical: { worldCupTitles: 0, bestFinish: 'Group (6 appearances)', appearances: 6, avgGroupPoints: 2.0, knockoutRate: 0 }, current: { formScore: 56, attackRating: 54, defenseRating: 58, squadDepth: 52 }, injuries: [] },

  BEL: { id: 'BEL', name: 'Belgium', flag: '🇧🇪', confederation: 'UEFA', group: 'G', fifaRank: 15, historical: { worldCupTitles: 0, bestFinish: '3rd (2018)', appearances: 14, avgGroupPoints: 4.0, knockoutRate: 0.43 }, current: { formScore: 73, attackRating: 74, defenseRating: 70, squadDepth: 71 }, injuries: [injury('K. De Bruyne', 'CAM', 'moderate', 0.09)] },
  EGY: { id: 'EGY', name: 'Egypt', flag: '🇪🇬', confederation: 'CAF', group: 'G', fifaRank: 34, historical: { worldCupTitles: 0, bestFinish: 'Group (1934, 1990, 2018)', appearances: 4, avgGroupPoints: 1.5, knockoutRate: 0 }, current: { formScore: 64, attackRating: 66, defenseRating: 62, squadDepth: 60 }, injuries: [injury('M. Salah', 'RW', 'minor', 0.05)] },
  IRN: { id: 'IRN', name: 'Iran', flag: '🇮🇷', confederation: 'AFC', group: 'G', fifaRank: 21, historical: { worldCupTitles: 0, bestFinish: 'Group (6 appearances)', appearances: 7, avgGroupPoints: 2.5, knockoutRate: 0 }, current: { formScore: 66, attackRating: 65, defenseRating: 68, squadDepth: 62 }, injuries: [] },
  NZL: { id: 'NZL', name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC', group: 'G', fifaRank: 94, historical: { worldCupTitles: 0, bestFinish: 'Group (2010)', appearances: 3, avgGroupPoints: 1.5, knockoutRate: 0 }, current: { formScore: 48, attackRating: 46, defenseRating: 50, squadDepth: 44 }, injuries: [] },

  ESP: { id: 'ESP', name: 'Spain', flag: '🇪🇸', confederation: 'UEFA', group: 'H', fifaRank: 3, historical: { worldCupTitles: 1, bestFinish: 'Winners (2010)', appearances: 17, avgGroupPoints: 5.2, knockoutRate: 0.71 }, current: { formScore: 86, attackRating: 87, defenseRating: 84, squadDepth: 85 }, injuries: [] },
  CPV: { id: 'CPV', name: 'Cape Verde', flag: '🇨🇻', confederation: 'CAF', group: 'H', fifaRank: 65, historical: { worldCupTitles: 0, bestFinish: 'Debut 2026', appearances: 1, avgGroupPoints: 0, knockoutRate: 0 }, current: { formScore: 54, attackRating: 52, defenseRating: 56, squadDepth: 50 }, injuries: [] },
  KSA: { id: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC', group: 'H', fifaRank: 56, historical: { worldCupTitles: 0, bestFinish: 'R16 (1994)', appearances: 7, avgGroupPoints: 2.0, knockoutRate: 0.14 }, current: { formScore: 58, attackRating: 56, defenseRating: 60, squadDepth: 54 }, injuries: [] },
  URU: { id: 'URU', name: 'Uruguay', flag: '🇺🇾', confederation: 'CONMEBOL', group: 'H', fifaRank: 9, historical: { worldCupTitles: 2, bestFinish: 'Winners', appearances: 15, avgGroupPoints: 4.5, knockoutRate: 0.67 }, current: { formScore: 79, attackRating: 78, defenseRating: 80, squadDepth: 76 }, injuries: [injury('L. Suárez', 'ST', 'moderate', 0.07)] },

  FRA: { id: 'FRA', name: 'France', flag: '🇫🇷', confederation: 'UEFA', group: 'I', fifaRank: 2, historical: { worldCupTitles: 2, bestFinish: 'Winners', appearances: 16, avgGroupPoints: 5.5, knockoutRate: 0.81 }, current: { formScore: 88, attackRating: 90, defenseRating: 85, squadDepth: 88 }, injuries: [injury('N. Kanté', 'CM', 'minor', 0.03)] },
  SEN: { id: 'SEN', name: 'Senegal', flag: '🇸🇳', confederation: 'CAF', group: 'I', fifaRank: 17, historical: { worldCupTitles: 0, bestFinish: 'QF (2002)', appearances: 4, avgGroupPoints: 3.5, knockoutRate: 0.25 }, current: { formScore: 72, attackRating: 73, defenseRating: 70, squadDepth: 68 }, injuries: [injury('S. Mané', 'LW', 'major', 0.10)] },
  IRQ: { id: 'IRQ', name: 'Iraq', flag: '🇮🇶', confederation: 'AFC', group: 'I', fifaRank: 58, historical: { worldCupTitles: 0, bestFinish: 'Group (1986)', appearances: 2, avgGroupPoints: 1.0, knockoutRate: 0 }, current: { formScore: 55, attackRating: 56, defenseRating: 54, squadDepth: 52 }, injuries: [injury('A. Hussein', 'ST', 'moderate', 0.06)] },
  NOR: { id: 'NOR', name: 'Norway', flag: '🇳🇴', confederation: 'UEFA', group: 'I', fifaRank: 43, historical: { worldCupTitles: 0, bestFinish: 'R16 (1998)', appearances: 4, avgGroupPoints: 2.5, knockoutRate: 0.25 }, current: { formScore: 75, attackRating: 82, defenseRating: 68, squadDepth: 70 }, injuries: [] },

  ARG: { id: 'ARG', name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL', group: 'J', fifaRank: 1, historical: { worldCupTitles: 3, bestFinish: 'Winners', appearances: 19, avgGroupPoints: 5.8, knockoutRate: 0.84 }, current: { formScore: 90, attackRating: 88, defenseRating: 86, squadDepth: 87 }, injuries: [injury('L. Messi', 'FW', 'minor', 0.04)] },
  ALG: { id: 'ALG', name: 'Algeria', flag: '🇩🇿', confederation: 'CAF', group: 'J', fifaRank: 32, historical: { worldCupTitles: 0, bestFinish: 'R16 (2014)', appearances: 5, avgGroupPoints: 2.8, knockoutRate: 0.2 }, current: { formScore: 66, attackRating: 68, defenseRating: 64, squadDepth: 62 }, injuries: [] },
  AUT: { id: 'AUT', name: 'Austria', flag: '🇦🇹', confederation: 'UEFA', group: 'J', fifaRank: 22, historical: { worldCupTitles: 0, bestFinish: '3rd (1954)', appearances: 8, avgGroupPoints: 3.0, knockoutRate: 0.25 }, current: { formScore: 71, attackRating: 72, defenseRating: 69, squadDepth: 68 }, injuries: [] },
  JOR: { id: 'JOR', name: 'Jordan', flag: '🇯🇴', confederation: 'AFC', group: 'J', fifaRank: 71, historical: { worldCupTitles: 0, bestFinish: 'Debut 2026', appearances: 1, avgGroupPoints: 0, knockoutRate: 0 }, current: { formScore: 50, attackRating: 48, defenseRating: 52, squadDepth: 46 }, injuries: [] },

  POR: { id: 'POR', name: 'Portugal', flag: '🇵🇹', confederation: 'UEFA', group: 'K', fifaRank: 6, historical: { worldCupTitles: 0, bestFinish: '3rd (1966)', appearances: 9, avgGroupPoints: 4.5, knockoutRate: 0.56 }, current: { formScore: 83, attackRating: 84, defenseRating: 78, squadDepth: 81 }, injuries: [injury('R. Leão', 'LW', 'minor', 0.03)] },
  COD: { id: 'COD', name: 'DR Congo', flag: '🇨🇩', confederation: 'CAF', group: 'K', fifaRank: 60, historical: { worldCupTitles: 0, bestFinish: 'Group (1974)', appearances: 2, avgGroupPoints: 1.5, knockoutRate: 0 }, current: { formScore: 57, attackRating: 58, defenseRating: 56, squadDepth: 54 }, injuries: [] },
  UZB: { id: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', confederation: 'AFC', group: 'K', fifaRank: 66, historical: { worldCupTitles: 0, bestFinish: 'Debut 2026', appearances: 1, avgGroupPoints: 0, knockoutRate: 0 }, current: { formScore: 54, attackRating: 55, defenseRating: 53, squadDepth: 50 }, injuries: [] },
  COL: { id: 'COL', name: 'Colombia', flag: '🇨🇴', confederation: 'CONMEBOL', group: 'K', fifaRank: 10, historical: { worldCupTitles: 0, bestFinish: 'QF (2014)', appearances: 7, avgGroupPoints: 4.0, knockoutRate: 0.43 }, current: { formScore: 78, attackRating: 79, defenseRating: 74, squadDepth: 75 }, injuries: [] },

  ENG: { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA', group: 'L', fifaRank: 4, historical: { worldCupTitles: 1, bestFinish: 'Winners (1966)', appearances: 17, avgGroupPoints: 4.8, knockoutRate: 0.65 }, current: { formScore: 84, attackRating: 83, defenseRating: 82, squadDepth: 83 }, injuries: [injury('H. Kane', 'ST', 'minor', 0.02)] },
  CRO: { id: 'CRO', name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA', group: 'L', fifaRank: 13, historical: { worldCupTitles: 0, bestFinish: 'Runners-up (2018)', appearances: 7, avgGroupPoints: 4.5, knockoutRate: 0.71 }, current: { formScore: 77, attackRating: 75, defenseRating: 78, squadDepth: 74 }, injuries: [injury('L. Modrić', 'CM', 'minor', 0.03)] },
  GHA: { id: 'GHA', name: 'Ghana', flag: '🇬🇭', confederation: 'CAF', group: 'L', fifaRank: 68, historical: { worldCupTitles: 0, bestFinish: 'QF (2010)', appearances: 5, avgGroupPoints: 2.5, knockoutRate: 0.2 }, current: { formScore: 60, attackRating: 62, defenseRating: 58, squadDepth: 56 }, injuries: [] },
  PAN: { id: 'PAN', name: 'Panama', flag: '🇵🇦', confederation: 'CONCACAF', group: 'L', fifaRank: 45, historical: { worldCupTitles: 0, bestFinish: 'Group (2018)', appearances: 2, avgGroupPoints: 1.5, knockoutRate: 0 }, current: { formScore: 52, attackRating: 50, defenseRating: 54, squadDepth: 48 }, injuries: [] },
}

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const

export const HOSTS = new Set(['USA', 'MEX', 'CAN'])

export function getTeam(id: string): Team {
  return TEAMS[id]
}

export function getTeamsByGroup(group: string): Team[] {
  return Object.values(TEAMS).filter((t) => t.group === group)
}

export function getAllTeams(): Team[] {
  return Object.values(TEAMS).sort((a, b) => a.fifaRank - b.fifaRank)
}
