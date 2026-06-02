"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Share2, Trophy } from "lucide-react";
import { formatDelta, formatScorecardShare, getScore, setScore, sortedTotals } from "@/lib/scoring";
import { useRound } from "@/lib/hooks";

export function ScoreboardClient({ roundId }: { roundId: string }) {
  const { round, save } = useRound(roundId);
  const [shared, setShared] = useState(false);

  if (!round) return <section className="section"><div className="panel">Loading scoreboard...</div></section>;

  const currentRound = round;

  async function cycleScore(playerId: string, holeNumber: number) {
    const current = getScore(currentRound, playerId, holeNumber);
    await save(setScore(currentRound, playerId, holeNumber, current === null ? 1 : current >= 9 ? null : current + 1));
  }

  async function shareScorecard() {
    const text = formatScorecardShare(currentRound);
    if (navigator.share) {
      await navigator.share({ title: `${currentRound.courseSnapshot.name} scorecard`, text });
    } else {
      await navigator.clipboard.writeText(text);
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 1800);
  }

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h1>Scoreboard</h1>
          <p className="lede">{currentRound.courseSnapshot.name}</p>
        </div>
        <div className="button-row">
          <button className="button primary" type="button" onClick={shareScorecard}>
            {shared ? <Check size={18} /> : <Share2 size={18} />} {shared ? "Shared" : "Share"}
          </button>
          <Link className="button" href={`/round/${currentRound.id}`}>
            <ChevronLeft size={18} /> Scoring
          </Link>
        </div>
      </div>

      <div className="scorecard-leaders">
        {sortedTotals(currentRound)
          .filter((total) => total.rank === 1)
          .map((total) => (
            <div className="winner-ring" key={total.player.id}>
              <Trophy size={18} />
              <span>{total.player.name}</span>
              <strong>{total.total}</strong>
            </div>
          ))}
      </div>

      <div className="table-wrap scoreboard-table-wrap">
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
                  <span className={total.rank === 1 ? "winner-name" : ""}>
                    #{total.rank} <span className="dot" style={{ background: total.player.color }} /> {total.player.name}
                  </span>
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
                <td><strong className={total.rank === 1 ? "winner-score" : ""}>{total.total}</strong></td>
                <td>{formatDelta(total.parDelta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-scorecards">
        {sortedTotals(currentRound).map((total) => (
          <article className={`mobile-scorecard ${total.rank === 1 ? "winner" : ""}`} key={total.player.id}>
            <div className="mobile-scorecard-head">
              <div>
                <span className="rank-chip">#{total.rank}</span>
                <h2 className={total.rank === 1 ? "winner-name" : ""}>
                  <span className="dot" style={{ background: total.player.color }} /> {total.player.name}
                </h2>
              </div>
              <div className={total.rank === 1 ? "winner-score score-total" : "score-total"}>
                <span>Total</span>
                <strong>{total.total}</strong>
              </div>
            </div>
            <div className="mobile-hole-grid">
              {currentRound.courseSnapshot.holes.map((hole) => {
                const strokes = getScore(currentRound, total.player.id, hole.number);
                const className =
                  strokes === 1 ? "cell-ace" : strokes !== null && strokes < hole.par ? "cell-under" : strokes !== null && strokes > hole.par ? "cell-over" : "";
                return (
                  <button
                    className={`hole-tile ${className}`}
                    type="button"
                    key={hole.number}
                    onClick={() => cycleScore(total.player.id, hole.number)}
                    aria-label={`${total.player.name}, hole ${hole.number}, ${strokes ?? "no score"}`}
                  >
                    <span>H{hole.number}</span>
                    <strong>{strokes ?? "-"}</strong>
                    <small>P{hole.par}</small>
                  </button>
                );
              })}
            </div>
            <div className="mobile-scorecard-foot">
              <span>{total.scoredHoles}/{currentRound.courseSnapshot.holeCount} holes</span>
              <strong>{formatDelta(total.parDelta)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
