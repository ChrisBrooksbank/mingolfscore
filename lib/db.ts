"use client";

import Dexie, { type Table } from "dexie";
import type { Course, Player, Round } from "@/lib/types";

class MiniGolfDatabase extends Dexie {
  players!: Table<Player, string>;
  courses!: Table<Course, string>;
  rounds!: Table<Round, string>;

  constructor() {
    super("mingolfscore");
    this.version(1).stores({
      players: "id, name, createdAt",
      courses: "id, name, status, updatedAt",
      rounds: "id, status, courseId, startedAt, updatedAt, completedAt",
    });
  }
}

export const db = new MiniGolfDatabase();

export function uid() {
  return crypto.randomUUID();
}

export function nowIso() {
  return new Date().toISOString();
}

export const playerColors = [
  "#0f766e",
  "#2563eb",
  "#dc2626",
  "#9333ea",
  "#ca8a04",
  "#0891b2",
  "#16a34a",
  "#ea580c",
];

export function playerColor(index: number) {
  return playerColors[index % playerColors.length];
}
