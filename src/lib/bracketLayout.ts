/** Side tree height — divisible by 8 (R32 match count) */
export const TREE_HEIGHT = 512

export const PAIR_HEIGHT = 54

export const SLOT_WIDTH = 132

export const CONNECTOR_WIDTH = 32

export const ROUND_SHORT = ['R32', 'R16', 'QF', 'SF'] as const

export const ROUND_LABELS: Record<number, string> = {
  0: 'Round of 32',
  1: 'Round of 16',
  2: 'Quarter-finals',
  3: 'Semi-finals',
}

const COL = SLOT_WIDTH
const GAP = CONNECTOR_WIDTH

/** Geometry for match m in round r (0=R32 … 3=SF) */
export function getMatchBlock(roundIndex: number, matchIndex: number) {
  const matchCount = 2 ** (3 - roundIndex)
  const blockSize = TREE_HEIGHT / matchCount
  const top = matchIndex * blockSize
  return {
    top,
    blockSize,
    centerY: top + blockSize / 2,
    matchCount,
  }
}

export function getRoundColumnX(roundIndex: number, side: 'left' | 'right') {
  const step = COL + GAP
  if (side === 'left') return roundIndex * step
  return (3 - roundIndex) * step
}

export function getConnectorGapX(roundIndex: number, side: 'left' | 'right') {
  if (side === 'left') return (roundIndex + 1) * COL + roundIndex * GAP
  return (3 - roundIndex) * COL + (3 - roundIndex - 1) * GAP
}

/** R32→R16→QF→SF connector paths */
export function buildSideConnectorPaths(side: 'left' | 'right'): string[] {
  const paths: string[] = []
  const innerOnRight = side === 'right'

  for (let r = 0; r < 3; r++) {
    const gapX = getConnectorGapX(r, side)
    const mid = gapX + GAP / 2
    const mergeCount = 2 ** (2 - r)

    for (let m = 0; m < mergeCount; m++) {
      const childA = getMatchBlock(r, m * 2)
      const childB = getMatchBlock(r, m * 2 + 1)
      const parent = getMatchBlock(r + 1, m)
      const { centerY: y1 } = childA
      const { centerY: y2 } = childB
      const { centerY: yP } = parent

      if (!innerOnRight) {
        paths.push(`M ${gapX} ${y1} H ${mid}`, `M ${gapX} ${y2} H ${mid}`, `M ${mid} ${y1} V ${y2}`, `M ${mid} ${yP} H ${gapX + GAP}`)
      } else {
        paths.push(`M ${gapX + GAP} ${y1} H ${mid}`, `M ${gapX + GAP} ${y2} H ${mid}`, `M ${mid} ${y1} V ${y2}`, `M ${mid} ${yP} H ${gapX}`)
      }
    }
  }

  return paths
}

export function getSidePanelWidth() {
  return 4 * COL + 4 * GAP
}

export function getFinalAlignY() {
  return getMatchBlock(3, 0).centerY
}
