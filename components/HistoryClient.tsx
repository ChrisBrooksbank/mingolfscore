"use client";

import Link from "next/link";
import { Calendar, Trophy } from "lucide-react";
import { useRounds } from "@/lib/hooks";
import { sortedTotals } from "@/lib/scoring";

export function HistoryClient() {
  const rounds = useRounds().filter((round) => round.status === "complete");

  return (
    <section className="section">
      <div>
        <h1>History</h1>
        <p className="lede">Every completed round, saved locally and available offline.</p>
      </div>

      {rounds.length === 0 ? (
        <div className="panel">
          <h2>No completed rounds yet</h2>
          <p className="muted">Finish a round to build history and rivalries.</p>
        </div>
      ) : (
        <div className="grid">
          {rounds.map((round) => {
            const winner = sortedTotals(round)[0];
            return (
              <Link className="card" href={`/round/${round.id}/results`} key={round.id}>
                <h3>
                  <Trophy size={18} /> {winner?.player.name ?? "Round"} won
                </h3>
                <p className="muted">{round.courseSnapshot.name}</p>
                <div className="pill-list">
                  <span className="pill">
                    <Calendar size={15} /> {new Date(round.completedAt ?? round.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="pill">{round.players.length} players</span>
                  <span className="pill">{round.courseSnapshot.holeCount} holes</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
