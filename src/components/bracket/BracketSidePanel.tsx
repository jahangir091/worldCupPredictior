import type { BracketMatch } from '../../types'
import { BRACKET_TREE } from '../../lib/bracketTree'
import {
  ROUND_LABELS,
  ROUND_SHORT,
  TREE_HEIGHT,
  SLOT_WIDTH,
  getMatchBlock,
  getRoundColumnX,
  getSidePanelWidth,
  buildSideConnectorPaths,
} from '../../lib/bracketLayout'
import { BracketMatchPair } from './BracketSlots'

interface BracketSidePanelProps {
  side: 'left' | 'right'
  matchMap: Map<number, BracketMatch>
  userWinners: Record<number, string>
  onPick?: (matchId: number, teamId: string) => void
  onClear?: (matchId: number) => void
}

export function BracketSidePanel({
  side,
  matchMap,
  userWinners,
  onPick,
  onClear,
}: BracketSidePanelProps) {
  const tree = BRACKET_TREE[side]
  const align = side === 'right' ? 'right' : 'left'
  const roundIds = [tree.r32, tree.r16, tree.qf, tree.sf] as const
  const panelWidth = getSidePanelWidth()
  const paths = buildSideConnectorPaths(side)

  return (
    <div className="shrink-0" style={{ width: panelWidth }}>
      <div className="relative mb-2" style={{ height: 16, width: panelWidth }}>
        {ROUND_SHORT.map((label, roundIndex) => (
          <div
            key={label}
            className="absolute text-center"
            style={{ left: getRoundColumnX(roundIndex, side), width: SLOT_WIDTH }}
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="relative overflow-visible" style={{ width: panelWidth, height: TREE_HEIGHT }}>
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={panelWidth}
          height={TREE_HEIGHT}
          aria-hidden
        >
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="rgba(148, 163, 184, 0.55)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {[0, 1, 2, 3].map((roundIndex) => (
          <div
            key={roundIndex}
            className="absolute top-0"
            style={{ left: getRoundColumnX(roundIndex, side), width: SLOT_WIDTH, height: TREE_HEIGHT }}
            title={ROUND_LABELS[roundIndex]}
          >
            {roundIds[roundIndex].map((id, matchIndex) => {
              const block = getMatchBlock(roundIndex, matchIndex)
              return (
                <div
                  key={id}
                  className="absolute flex w-full items-center"
                  style={{ top: block.top, height: block.blockSize }}
                >
                  <BracketMatchPair
                    match={matchMap.get(id)}
                    userWinner={userWinners[id]}
                    align={align}
                    onPick={onPick}
                    onClear={onClear}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
