"use client";

import Link from "next/link";
import { Copy, RotateCcw, Trophy } from "lucide-react";
import { generateAwards, sortedTotals } from "@/lib/scoring";
import { useRound } from "@/lib/hooks";

export function ResultsClient({ roundId }: { roundId: string }) {
  const { round } = useRound(roundId);

  if (!round) return <section className="section"><div className="panel">Loading results...</div></section>;

  const totals = sortedTotals(round);
  const awards = generateAwards(round);
  const winner = totals[0];
  const summary = `${round.courseSnapshot.name}: ${totals.map((total) => `${total.player.name} ${total.total}`).join(", ")}`;

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: "Mini golf results", text: summary });
    } else {
      await navigator.clipboard.writeText(summary);
    }
  }

  return (
    <section className="section">
      <div className="panel winner">
        <p className="muted">Final results</p>
        <h1><Trophy size={28} /> {winner ? `${winner.player.name} wins` : "Round complete"}</h1>
        <p className="lede">{round.courseSnapshot.name}</p>
        <div className="button-row">
          <button className="button primary" type="button" onClick={share}>
            <Copy size={18} /> Share
          </button>
          <Link className="button" href={`/new?course=${round.courseId ?? ""}`}>
            <RotateCcw size={18} /> Rematch
          </Link>
        </div>
      </div>

      <div className="grid">
        {totals.map((total) => (
          <div className="card" key={total.player.id}>
            <h2>#{total.rank} {total.player.name}</h2>
            <p className="hole-number">{total.total}</p>
            <p className="muted">{total.holeInOnes} aces · {total.scoredHoles} holes</p>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Awards</h2>
        <div className="grid">
          {awards.map((award) => (
            <div className="card" key={award.title}>
              <h3>{award.title}</h3>
              <p className="muted">{award.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <Link className="button" href={`/round/${round.id}/scoreboard`}>
        Full scorecard
      </Link>
    </section>
  );
}
