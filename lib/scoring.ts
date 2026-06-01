import type { PlayerTotal, Round, RoundAward, ScoreEntry } from "@/lib/types";

export function getScore(round: Round, playerId: string, holeNumber: number) {
  return (
    round.scores.find(
      (score) => score.playerId === playerId && score.holeNumber === holeNumber,
    )?.strokes ?? null
  );
}

export function setScore(
  round: Round,
  playerId: string,
  holeNumber: number,
  strokes: number | null,
): Round {
  const now = new Date().toISOString();
  const nextScores = round.scores.filter(
    (score) => !(score.playerId === playerId && score.holeNumber === holeNumber),
  );

  const cleanStrokes =
    strokes === null ? null : Math.max(1, Math.min(20, Math.round(strokes)));

  const entry: ScoreEntry = {
    playerId,
    holeNumber,
    strokes: cleanStrokes,
    updatedAt: now,
  };

  return {
    ...round,
    scores: [...nextScores, entry],
    updatedAt: now,
  };
}

export function calculateTotals(round: Round): PlayerTotal[] {
  const rawTotals = round.players.map((player) => {
    let total = 0;
    let scoredHoles = 0;
    let parDelta = 0;
    let holeInOnes = 0;

    for (const hole of round.courseSnapshot.holes) {
      const strokes = getScore(round, player.id, hole.number);
      if (strokes !== null) {
        total += strokes;
        scoredHoles += 1;
        parDelta += strokes - hole.par;
        if (strokes === 1) {
          holeInOnes += 1;
        }
      }
    }

    return {
      player,
      total,
      scoredHoles,
      parDelta,
      holeInOnes,
      rank: 1,
      complete: scoredHoles === round.courseSnapshot.holeCount,
    };
  });

  const ranked = [...rawTotals].sort((a, b) => {
    if (a.total !== b.total) return a.total - b.total;
    return b.scoredHoles - a.scoredHoles;
  });

  let previousTotal: number | null = null;
  let previousScored: number | null = null;
  let previousRank = 0;

  ranked.forEach((item, index) => {
    const rank =
      previousTotal === item.total && previousScored === item.scoredHoles
        ? previousRank
        : index + 1;
    item.rank = rank;
    previousRank = rank;
    previousTotal = item.total;
    previousScored = item.scoredHoles;
  });

  return rawTotals.map((total) => ranked.find((item) => item.player.id === total.player.id) ?? total);
}

export function isRoundComplete(round: Round) {
  return round.players.every((player) =>
    round.courseSnapshot.holes.every((hole) => getScore(round, player.id, hole.number) !== null),
  );
}

export function completeRound(round: Round): Round {
  return {
    ...round,
    status: "complete",
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function sortedTotals(round: Round) {
  return [...calculateTotals(round)].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.player.name.localeCompare(b.player.name);
  });
}

export function generateAwards(round: Round): RoundAward[] {
  const totals = sortedTotals(round);
  const awards: RoundAward[] = [];
  const winner = totals[0];

  if (winner) {
    awards.push({
      title: winner.rank === 1 && totals[1]?.rank === 1 ? "Shared glory" : "Champion",
      detail: `${winner.player.name} finished at ${winner.total} strokes.`,
    });
  }

  const aceLeader = [...totals].sort((a, b) => b.holeInOnes - a.holeInOnes)[0];
  if (aceLeader && aceLeader.holeInOnes > 0) {
    awards.push({
      title: "Ace hunter",
      detail: `${aceLeader.player.name} made ${aceLeader.holeInOnes} hole-in-one${aceLeader.holeInOnes === 1 ? "" : "s"}.`,
    });
  }

  const mostConsistent = totals
    .map((total) => {
      const values = round.courseSnapshot.holes
        .map((hole) => getScore(round, total.player.id, hole.number))
        .filter((score): score is number => score !== null);
      const average = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
      const variance =
        values.reduce((sum, value) => sum + Math.abs(value - average), 0) / Math.max(values.length, 1);
      return { total, variance };
    })
    .sort((a, b) => a.variance - b.variance)[0];

  if (mostConsistent && mostConsistent.total.scoredHoles > 2) {
    awards.push({
      title: "Most consistent",
      detail: `${mostConsistent.total.player.name} kept the steadiest card.`,
    });
  }

  const tightGap = totals.length > 1 ? totals[1].total - totals[0].total : null;
  if (tightGap !== null && tightGap <= 2) {
    awards.push({
      title: "Photo finish",
      detail: `Only ${tightGap} stroke${tightGap === 1 ? "" : "s"} separated first and second.`,
    });
  }

  return awards.slice(0, 4);
}

export function formatDelta(delta: number) {
  if (delta === 0) return "E";
  return delta > 0 ? `+${delta}` : `${delta}`;
}

export function createDefaultHoles(holeCount: number, par = 3) {
  return Array.from({ length: holeCount }, (_, index) => ({
    number: index + 1,
    par,
  }));
}
