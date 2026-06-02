"use client";

import { useEffect, useState } from "react";
import type { Course, Player, Round } from "@/lib/types";
import { db } from "@/lib/db";
import { ensureDefaultCourse } from "@/lib/defaultCourse";

export function useRounds() {
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    let mounted = true;
    db.rounds.orderBy("updatedAt").reverse().toArray().then((items) => {
      if (mounted) setRounds(items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return rounds;
}

export function useCourses(includeArchived = false) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let mounted = true;
    ensureDefaultCourse()
      .then(() => db.courses.orderBy("updatedAt").reverse().toArray())
      .then((items) => {
        if (mounted) {
          setCourses(includeArchived ? items : items.filter((course) => course.status === "active"));
        }
      });
    return () => {
      mounted = false;
    };
  }, [includeArchived]);

  return courses;
}

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let mounted = true;
    db.players.orderBy("createdAt").toArray().then((items) => {
      if (mounted) setPlayers(items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return players;
}

export function useRound(roundId: string) {
  const [round, setRound] = useState<Round | null>(null);

  useEffect(() => {
    let mounted = true;
    db.rounds.get(roundId).then((item) => {
      if (mounted) setRound(item ?? null);
    });
    return () => {
      mounted = false;
    };
  }, [roundId]);

  async function save(nextRound: Round) {
    setRound(nextRound);
    await db.rounds.put(nextRound);
  }

  return { round, save, setRound };
}
