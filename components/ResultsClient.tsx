"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, RotateCcw, Trophy } from "lucide-react";
import { formatScorecardShare, generateAwards, sortedTotals } from "@/lib/scoring";
import { useRound } from "@/lib/hooks";
import { shareLabel, shareText, type ShareOutcome } from "@/lib/share";
import { RoundNotFound } from "@/components/RoundNotFound";

export function ResultsClient({ roundId }: { roundId: string }) {
  const { round, loaded } = useRound(roundId);
  const [shareOutcome, setShareOutcome] = useState<ShareOutcome | null>(null);

  if (!round && loaded) return <RoundNotFound />;
  if (!round) return <section className="section"><div className="panel">Loading results...</div></section>;

  const totals = sortedTotals(round);
  const awards = generateAwards(round);
  const winner = totals[0];
  const summary = formatScorecardShare(round);

  async function share() {
    const outcome = await shareText("Mini golf results", summary);
    if (outcome === "cancelled") return;
    setShareOutcome(outcome);
    window.setTimeout(() => setShareOutcome(null), 1800);
  }

  return (
    <section className="section">
      <div className="panel winner">
        <p className="muted">Final results</p>
        <h1><Trophy size={28} /> {winner ? `${winner.player.name} wins` : "Round complete"}</h1>
        <p className="lede">{round.courseSnapshot.name}</p>
        <div className="button-row">
          <button className="button primary" type="button" onClick={share}>
            {shareOutcome === "shared" || shareOutcome === "copied" ? <Check size={18} /> : <Copy size={18} />} {shareLabel(shareOutcome)}
          </button>
          <Link className="button" href={`/new?rematch=${round.id}`}>
            <RotateCcw size={18} /> Rematch
          </Link>
        </div>
      </div>

      <div className="grid">
        {totals.map((total) => (
          <div className="card" key={total.player.id}>
            <h2 className={total.rank === 1 ? "winner-name" : ""}>#{total.rank} {total.player.name}</h2>
            <p className={total.rank === 1 ? "hole-number winner-score" : "hole-number"}>{total.total}</p>
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
