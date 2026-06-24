import type { Match } from '../types'

/** Bundled snapshot — refreshed live via reload button */
export const SNAPSHOT_DATE = '2026-06-23'

const m = (
  id: number,
  date: string,
  time: string,
  homeId: string,
  awayId: string,
  stadiumId: string,
  opts: Partial<Match> = {}
): Match => ({
  id,
  date,
  time,
  homeId,
  awayId,
  stadiumId,
  status: 'scheduled',
  ...opts,
})

export const BASE_GROUP_MATCHES: Match[] = [
  // Matchday 1
  m(1, '2026-06-11', '19:00', 'MEX', 'RSA', 'mexico_city', { group: 'A', homeScore: 2, awayScore: 0, status: 'finished' }),
  m(2, '2026-06-12', '19:00', 'KOR', 'CZE', 'zapopan', { group: 'A', homeScore: 2, awayScore: 1, status: 'finished' }),
  m(3, '2026-06-12', '19:00', 'CAN', 'BIH', 'toronto', { group: 'B', homeScore: 1, awayScore: 1, status: 'finished' }),
  m(4, '2026-06-13', '19:00', 'USA', 'PAR', 'los_angeles', { group: 'D', homeScore: 4, awayScore: 1, status: 'finished' }),
  m(5, '2026-06-13', '19:00', 'QAT', 'SUI', 'santa_clara', { group: 'B', homeScore: 1, awayScore: 1, status: 'finished' }),
  m(6, '2026-06-13', '19:00', 'BRA', 'MAR', 'new_jersey', { group: 'C', homeScore: 1, awayScore: 1, status: 'finished' }),
  m(7, '2026-06-14', '19:00', 'HAI', 'SCO', 'foxborough', { group: 'C', homeScore: 0, awayScore: 1, status: 'finished' }),
  m(8, '2026-06-14', '19:00', 'AUS', 'TUR', 'vancouver', { group: 'D', homeScore: 2, awayScore: 0, status: 'finished' }),
  m(9, '2026-06-14', '19:00', 'GER', 'CUW', 'houston', { group: 'E', homeScore: 7, awayScore: 1, status: 'finished' }),
  m(10, '2026-06-14', '19:00', 'NED', 'JPN', 'arlington', { group: 'F', homeScore: 2, awayScore: 2, status: 'finished' }),
  m(11, '2026-06-15', '19:00', 'CIV', 'ECU', 'philadelphia', { group: 'E', homeScore: 1, awayScore: 0, status: 'finished' }),
  m(12, '2026-06-15', '19:00', 'SWE', 'TUN', 'guadalupe', { group: 'F', homeScore: 5, awayScore: 1, status: 'finished' }),
  m(13, '2026-06-15', '19:00', 'ESP', 'CPV', 'atlanta', { group: 'H', homeScore: 0, awayScore: 0, status: 'finished' }),
  m(14, '2026-06-15', '19:00', 'BEL', 'EGY', 'seattle', { group: 'G', homeScore: 1, awayScore: 1, status: 'finished' }),
  m(15, '2026-06-15', '19:00', 'KSA', 'URU', 'miami', { group: 'H', homeScore: 1, awayScore: 1, status: 'finished' }),
  m(16, '2026-06-16', '19:00', 'IRN', 'NZL', 'los_angeles', { group: 'G', homeScore: 2, awayScore: 2, status: 'finished' }),
  m(17, '2026-06-16', '19:00', 'FRA', 'SEN', 'new_jersey', { group: 'I', homeScore: 3, awayScore: 1, status: 'finished' }),
  m(18, '2026-06-16', '19:00', 'IRQ', 'NOR', 'foxborough', { group: 'I', homeScore: 1, awayScore: 4, status: 'finished' }),
  m(19, '2026-06-17', '19:00', 'ARG', 'ALG', 'kansas_city', { group: 'J', homeScore: 3, awayScore: 0, status: 'finished' }),
  m(20, '2026-06-17', '19:00', 'AUT', 'JOR', 'santa_clara', { group: 'J', homeScore: 3, awayScore: 1, status: 'finished' }),
  m(21, '2026-06-17', '19:00', 'POR', 'COD', 'houston', { group: 'K', homeScore: 1, awayScore: 1, status: 'finished' }),
  m(22, '2026-06-17', '19:00', 'ENG', 'CRO', 'dallas', { group: 'L', homeScore: 4, awayScore: 2, status: 'finished' }),

  // Matchday 2
  m(23, '2026-06-18', '19:00', 'GHA', 'PAN', 'toronto', { group: 'L', homeScore: 1, awayScore: 0, status: 'finished' }),
  m(24, '2026-06-18', '19:00', 'UZB', 'COL', 'mexico_city', { group: 'K', homeScore: 1, awayScore: 3, status: 'finished' }),
  m(25, '2026-06-18', '19:00', 'CZE', 'RSA', 'atlanta', { group: 'A', homeScore: 1, awayScore: 1, status: 'finished' }),
  m(26, '2026-06-18', '19:00', 'SUI', 'BIH', 'los_angeles', { group: 'B', homeScore: 4, awayScore: 1, status: 'finished' }),
  m(27, '2026-06-18', '19:00', 'CAN', 'QAT', 'vancouver', { group: 'B', homeScore: 6, awayScore: 0, status: 'finished' }),
  m(28, '2026-06-19', '19:00', 'MEX', 'KOR', 'zapopan', { group: 'A', homeScore: 1, awayScore: 0, status: 'finished' }),
  m(29, '2026-06-19', '19:00', 'USA', 'AUS', 'seattle', { group: 'D', homeScore: 2, awayScore: 0, status: 'finished' }),
  m(30, '2026-06-19', '19:00', 'SCO', 'MAR', 'foxborough', { group: 'C', homeScore: 0, awayScore: 1, status: 'finished' }),
  m(31, '2026-06-20', '19:00', 'BRA', 'HAI', 'philadelphia', { group: 'C', homeScore: 3, awayScore: 0, status: 'finished' }),
  m(32, '2026-06-20', '19:00', 'TUR', 'PAR', 'santa_clara', { group: 'D', homeScore: 0, awayScore: 1, status: 'finished' }),
  m(33, '2026-06-20', '19:00', 'NED', 'SWE', 'houston', { group: 'F', homeScore: 5, awayScore: 1, status: 'finished' }),
  m(34, '2026-06-20', '19:00', 'GER', 'CIV', 'toronto', { group: 'E', homeScore: 2, awayScore: 1, status: 'finished' }),
  m(35, '2026-06-21', '19:00', 'ECU', 'CUW', 'kansas_city', { group: 'E', homeScore: 0, awayScore: 0, status: 'finished' }),
  m(36, '2026-06-21', '19:00', 'TUN', 'JPN', 'guadalupe', { group: 'F', homeScore: 0, awayScore: 4, status: 'finished' }),
  m(37, '2026-06-21', '19:00', 'ESP', 'KSA', 'atlanta', { group: 'H', homeScore: 4, awayScore: 0, status: 'finished' }),
  m(38, '2026-06-21', '19:00', 'BEL', 'IRN', 'los_angeles', { group: 'G', homeScore: 0, awayScore: 0, status: 'finished' }),
  m(39, '2026-06-21', '19:00', 'URU', 'CPV', 'miami', { group: 'H', homeScore: 2, awayScore: 2, status: 'finished' }),
  m(40, '2026-06-22', '19:00', 'NZL', 'EGY', 'vancouver', { group: 'G', homeScore: 1, awayScore: 3, status: 'finished' }),
  m(41, '2026-06-22', '19:00', 'ARG', 'AUT', 'arlington', { group: 'J', homeScore: 2, awayScore: 0, status: 'finished' }),
  m(42, '2026-06-22', '19:00', 'FRA', 'IRQ', 'philadelphia', { group: 'I', homeScore: 3, awayScore: 0, status: 'finished' }),

  // Matchday 3 (partial — through June 23 morning results)
  m(43, '2026-06-23', '18:00', 'NOR', 'SEN', 'toronto', { group: 'I', homeScore: 3, awayScore: 2, status: 'finished' }),
  m(44, '2026-06-23', '18:00', 'JOR', 'ALG', 'santa_clara', { group: 'J', homeScore: 1, awayScore: 2, status: 'finished' }),
  m(45, '2026-06-23', '18:00', 'POR', 'UZB', 'houston', { group: 'K' }),
  m(46, '2026-06-23', '21:00', 'ENG', 'GHA', 'boston', { group: 'L' }),
  m(47, '2026-06-24', '00:00', 'PAN', 'CRO', 'foxborough', { group: 'L' }),
  m(48, '2026-06-24', '03:00', 'COL', 'COD', 'zapopan', { group: 'K' }),
  m(49, '2026-06-24', '20:00', 'SUI', 'CAN', 'vancouver', { group: 'B' }),
  m(50, '2026-06-24', '20:00', 'BIH', 'QAT', 'seattle', { group: 'B' }),
  m(51, '2026-06-24', '23:00', 'MAR', 'HAI', 'atlanta', { group: 'C' }),
  m(52, '2026-06-24', '23:00', 'SCO', 'BRA', 'miami', { group: 'C' }),
  m(53, '2026-06-25', '02:00', 'RSA', 'KOR', 'guadalupe', { group: 'A' }),
  m(54, '2026-06-25', '02:00', 'CZE', 'MEX', 'mexico_city', { group: 'A' }),
  m(55, '2026-06-25', '21:00', 'CUW', 'CIV', 'philadelphia', { group: 'E' }),
  m(56, '2026-06-25', '21:00', 'ECU', 'GER', 'new_jersey', { group: 'E' }),
  m(57, '2026-06-26', '00:00', 'TUN', 'NED', 'kansas_city', { group: 'F' }),
  m(58, '2026-06-26', '00:00', 'JPN', 'SWE', 'arlington', { group: 'F' }),
  m(59, '2026-06-26', '03:00', 'TUR', 'USA', 'los_angeles', { group: 'D' }),
  m(60, '2026-06-26', '03:00', 'PAR', 'AUS', 'santa_clara', { group: 'D' }),
  m(61, '2026-06-26', '20:00', 'NOR', 'FRA', 'foxborough', { group: 'I' }),
  m(62, '2026-06-26', '20:00', 'SEN', 'IRQ', 'toronto', { group: 'I' }),
  m(63, '2026-06-27', '01:00', 'CPV', 'KSA', 'houston', { group: 'H' }),
  m(64, '2026-06-27', '01:00', 'URU', 'ESP', 'zapopan', { group: 'H' }),
  m(65, '2026-06-27', '04:00', 'NZL', 'BEL', 'vancouver', { group: 'G' }),
  m(66, '2026-06-27', '04:00', 'EGY', 'IRN', 'seattle', { group: 'G' }),
  m(67, '2026-06-27', '22:00', 'PAN', 'ENG', 'new_jersey', { group: 'L' }),
  m(68, '2026-06-27', '22:00', 'CRO', 'GHA', 'philadelphia', { group: 'L' }),
  m(69, '2026-06-28', '00:30', 'COL', 'POR', 'miami', { group: 'K' }),
  m(70, '2026-06-28', '00:30', 'COD', 'UZB', 'atlanta', { group: 'K' }),
  m(71, '2026-06-28', '03:00', 'ALG', 'AUT', 'kansas_city', { group: 'J' }),
  m(72, '2026-06-28', '03:00', 'JOR', 'ARG', 'arlington', { group: 'J' }),
]

/** @deprecated Use groupMatches from SimulationContext */
export const GROUP_MATCHES = BASE_GROUP_MATCHES

export const KNOCKOUT_TEMPLATE: Omit<Match, 'homeId' | 'awayId' | 'status'>[] = [
  { id: 73, date: '2026-06-28', time: '20:00', round: 'r32', stadiumId: 'los_angeles', bracketLabel: '2A vs 2B' },
  { id: 74, date: '2026-06-29', time: '21:30', round: 'r32', stadiumId: 'foxborough', bracketLabel: '1E vs 3rd (A/B/C/D/F)' },
  { id: 75, date: '2026-06-30', time: '02:00', round: 'r32', stadiumId: 'guadalupe', bracketLabel: '1F vs 2C' },
  { id: 76, date: '2026-06-29', time: '18:00', round: 'r32', stadiumId: 'houston', bracketLabel: '1C vs 2F' },
  { id: 77, date: '2026-06-30', time: '22:00', round: 'r32', stadiumId: 'new_jersey', bracketLabel: '1I vs 3rd (C/D/F/G/H)' },
  { id: 78, date: '2026-06-30', time: '18:00', round: 'r32', stadiumId: 'arlington', bracketLabel: '2E vs 2I' },
  { id: 79, date: '2026-07-01', time: '02:00', round: 'r32', stadiumId: 'mexico_city', bracketLabel: '1A vs 3rd (C/E/F/H/I)' },
  { id: 80, date: '2026-07-01', time: '17:00', round: 'r32', stadiumId: 'atlanta', bracketLabel: '1L vs 3rd (E/H/I/J/K)' },
  { id: 81, date: '2026-07-02', time: '01:00', round: 'r32', stadiumId: 'santa_clara', bracketLabel: '1D vs 3rd (B/E/F/I/J)' },
  { id: 82, date: '2026-07-01', time: '21:00', round: 'r32', stadiumId: 'seattle', bracketLabel: '1G vs 3rd (A/E/H/I/J)' },
  { id: 83, date: '2026-07-03', time: '00:00', round: 'r32', stadiumId: 'toronto', bracketLabel: '2K vs 2L' },
  { id: 84, date: '2026-07-02', time: '20:00', round: 'r32', stadiumId: 'los_angeles', bracketLabel: '1H vs 2J' },
  { id: 85, date: '2026-07-03', time: '04:00', round: 'r32', stadiumId: 'vancouver', bracketLabel: '1B vs 3rd (E/F/G/I/J)' },
  { id: 86, date: '2026-07-03', time: '23:00', round: 'r32', stadiumId: 'miami', bracketLabel: '1J vs 2H' },
  { id: 87, date: '2026-07-04', time: '02:30', round: 'r32', stadiumId: 'kansas_city', bracketLabel: '1K vs 3rd (D/E/I/J/L)' },
  { id: 88, date: '2026-07-03', time: '19:00', round: 'r32', stadiumId: 'arlington', bracketLabel: '2D vs 2G' },
  { id: 89, date: '2026-07-04', time: '22:00', round: 'r32', stadiumId: 'philadelphia', bracketLabel: 'W74 vs W77' },
  { id: 90, date: '2026-07-04', time: '18:00', round: 'r16', stadiumId: 'houston', bracketLabel: 'W73 vs W75' },
  { id: 91, date: '2026-07-05', time: '21:00', round: 'r16', stadiumId: 'new_jersey', bracketLabel: 'W76 vs W78' },
  { id: 92, date: '2026-07-06', time: '01:00', round: 'r16', stadiumId: 'mexico_city', bracketLabel: 'W79 vs W80' },
  { id: 93, date: '2026-07-06', time: '20:00', round: 'r16', stadiumId: 'arlington', bracketLabel: 'W83 vs W84' },
  { id: 94, date: '2026-07-07', time: '01:00', round: 'r16', stadiumId: 'seattle', bracketLabel: 'W81 vs W82' },
  { id: 95, date: '2026-07-07', time: '17:00', round: 'r16', stadiumId: 'atlanta', bracketLabel: 'W86 vs W88' },
  { id: 96, date: '2026-07-07', time: '21:00', round: 'r16', stadiumId: 'vancouver', bracketLabel: 'W85 vs W87' },
  { id: 97, date: '2026-07-09', time: '21:00', round: 'qf', stadiumId: 'foxborough', bracketLabel: 'W89 vs W90' },
  { id: 98, date: '2026-07-10', time: '20:00', round: 'qf', stadiumId: 'los_angeles', bracketLabel: 'W93 vs W94' },
  { id: 99, date: '2026-07-11', time: '22:00', round: 'qf', stadiumId: 'miami', bracketLabel: 'W91 vs W92' },
  { id: 100, date: '2026-07-12', time: '02:00', round: 'qf', stadiumId: 'kansas_city', bracketLabel: 'W95 vs W96' },
  { id: 101, date: '2026-07-14', time: '20:00', round: 'sf', stadiumId: 'arlington', bracketLabel: 'W97 vs W98' },
  { id: 102, date: '2026-07-15', time: '20:00', round: 'sf', stadiumId: 'atlanta', bracketLabel: 'W99 vs W100' },
  { id: 103, date: '2026-07-18', time: '22:00', round: 'third', stadiumId: 'miami', bracketLabel: 'L101 vs L102' },
  { id: 104, date: '2026-07-19', time: '20:00', round: 'final', stadiumId: 'new_jersey', bracketLabel: 'W101 vs W102' },
]

export function getAllGroupMatches(): Match[] {
  return GROUP_MATCHES
}

export function getMatchById(id: number): Match | undefined {
  return GROUP_MATCHES.find((m) => m.id === id)
}
