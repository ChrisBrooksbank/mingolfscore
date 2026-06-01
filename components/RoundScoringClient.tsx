"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Minus, Plus, Trophy } from "lucide-react";
import { completeRound, getScore, isRoundComplete, setScore, sortedTotals } from "@/lib/scoring";
import { useRound } from "@/lib/hooks";

export function RoundScoringClient({ roundId }: { roundId: string }) {
  const { round, save } = useRound(roundId);

  if (!round) {
    return <section className="section"><div className="panel">Loading round...</div></section>;
  }

  const currentRound = round;
  const hole = currentRound.courseSnapshot.holes.find((item) => item.number === currentRound.currentHole) ?? currentRound.courseSnapshot.holes[0];
  const totals = sortedTotals(currentRound);
  const complete = isRoundComplete(currentRound);

  async function changeHole(nextHole: number) {
    await save({
      ...currentRound,
      currentHole: Math.max(1, Math.min(currentRound.courseSnapshot.holeCount, nextHole)),
      updatedAt: new Date().toISOString(),
    });
  }

  async function score(playerId: string, strokes: number | null) {
    await save(setScore(currentRound, playerId, hole.number, strokes));
  }

  async function finish() {
    if (!isRoundComplete(currentRound)) return;
    const completed = completeRound(currentRound);
    await save(completed);
    window.location.href = `/round/${currentRound.id}/results`;
  }

  return (
    <section className="score-screen">
      <div className="score-top">
        <div>
          <p className="muted">{currentRound.courseSnapshot.name}</p>
          <h1>Hole {hole.number}</h1>
          <p className="muted">{hole.name || "Untitled"} · Par {hole.par}</p>
        </div>
        <div className="panel">
          <div className="hole-number">{hole.number}</div>
          <p className="muted">of {currentRound.courseSnapshot.holeCount}</p>
        </div>
      </div>

      <div className="button-row">
        <button className="button" type="button" onClick={() => changeHole(currentRound.currentHole - 1)} disabled={currentRound.currentHole === 1}>
          <ChevronLeft size={18} /> Previous
        </button>
        <button className="button" type="button" onClick={() => changeHole(currentRound.currentHole + 1)} disabled={currentRound.currentHole === currentRound.courseSnapshot.holeCount}>
          Next <ChevronRight size={18} />
        </button>
        <Link className="button" href={`/round/${currentRound.id}/scoreboard`}>
          Scoreboard
        </Link>
        <button className="button primary" type="button" disabled={!complete} onClick={finish}>
          <CheckCircle2 size={18} /> Finish
        </button>
      </div>

      <div className="panel">
        <div className="pill-list">
          {totals.map((total) => (
            <span className="pill" key={total.player.id}>
              #{total.rank} {total.player.name}: {total.total || 0}
            </span>
          ))}
        </div>
      </div>

      {currentRound.players.map((player) => {
        const current = getScore(currentRound, player.id, hole.number);
        return (
          <div className="player-score" key={player.id}>
            <div>
              <div className="player-name">
                <span className="dot" style={{ background: player.color }} />
                <span>{player.name}</span>
              </div>
              <div className="quick-grid" style={{ marginTop: 10 }}>
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <button
                    className={value === 1 ? "cell-ace" : ""}
                    type="button"
                    key={value}
                    onClick={() => score(player.id, value)}
                    aria-label={`${player.name} scored ${value}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="score-controls">
              <button className="icon-button" type="button" onClick={() => score(player.id, Math.max(1, (current ?? 1) - 1))}>
                <Minus size={19} />
              </button>
              <button className="score-value" type="button" onClick={() => score(player.id, null)} title="Clear score">
                {current ?? "-"}
              </button>
              <button className="icon-button" type="button" onClick={() => score(player.id, (current ?? 0) + 1)}>
                <Plus size={19} />
              </button>
            </div>
          </div>
        );
      })}

      {currentRound.status === "complete" ? (
        <Link className="button primary" href={`/round/${currentRound.id}/results`}>
          <Trophy size={18} /> View results
        </Link>
      ) : null}
    </section>
  );
}
