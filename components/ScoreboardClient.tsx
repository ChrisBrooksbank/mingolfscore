"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatDelta, getScore, setScore, sortedTotals } from "@/lib/scoring";
import { useRound } from "@/lib/hooks";

export function ScoreboardClient({ roundId }: { roundId: string }) {
  const { round, save } = useRound(roundId);

  if (!round) return <section className="section"><div className="panel">Loading scoreboard...</div></section>;

  const currentRound = round;

  async function cycleScore(playerId: string, holeNumber: number) {
    const current = getScore(currentRound, playerId, holeNumber);
    await save(setScore(currentRound, playerId, holeNumber, current === null ? 1 : current >= 9 ? null : current + 1));
  }

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h1>Scoreboard</h1>
          <p className="lede">{currentRound.courseSnapshot.name}</p>
        </div>
        <Link className="button" href={`/round/${currentRound.id}`}>
          <ChevronLeft size={18} /> Scoring
        </Link>
      </div>

      <div className="table-wrap">
        <table className="score-table">
          <thead>
            <tr>
              <th>Player</th>
              {currentRound.courseSnapshot.holes.map((hole) => (
                <th key={hole.number}>H{hole.number}<br />P{hole.par}</th>
              ))}
              <th>Total</th>
              <th>+/-</th>
            </tr>
          </thead>
          <tbody>
            {sortedTotals(currentRound).map((total) => (
              <tr key={total.player.id} className={total.rank === 1 ? "winner" : ""}>
                <td>
                  #{total.rank} <span className="dot" style={{ background: total.player.color }} /> {total.player.name}
                </td>
                {currentRound.courseSnapshot.holes.map((hole) => {
                  const strokes = getScore(currentRound, total.player.id, hole.number);
                  const className =
                    strokes === 1 ? "cell-ace" : strokes !== null && strokes < hole.par ? "cell-under" : strokes !== null && strokes > hole.par ? "cell-over" : "";
                  return (
                    <td key={hole.number}>
                      <button className={`pill ${className}`} type="button" onClick={() => cycleScore(total.player.id, hole.number)}>
                        {strokes ?? "-"}
                      </button>
                    </td>
                  );
                })}
                <td><strong>{total.total}</strong></td>
                <td>{formatDelta(total.parDelta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
