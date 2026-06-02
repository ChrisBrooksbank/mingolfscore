"use client";

import { db, nowIso } from "@/lib/db";
import type { Course, Hole } from "@/lib/types";

export const DEFAULT_COURSE_ID = "default-18-hole-course";

const defaultHoleNames = [
  "Warm Up",
  "The Ramp",
  "Bank Shot",
  "Castle Gate",
  "Loop",
  "Bridge",
  "Dogleg",
  "Windmill",
  "Tunnel",
  "Water Run",
  "Twin Bumps",
  "Side Door",
  "Snake Bend",
  "Long Lane",
  "Drop Shot",
  "Volcano",
  "Final Bend",
  "Home Hole",
];

export function createDefaultCourseHoles(): Hole[] {
  return defaultHoleNames.map((name, index) => ({
    number: index + 1,
    name,
    par: 3,
  }));
}

export async function ensureDefaultCourse() {
  const existing = await db.courses.get(DEFAULT_COURSE_ID);
  if (existing) return existing;

  const now = nowIso();
  const course: Course = {
    id: DEFAULT_COURSE_ID,
    name: "Ready-to-Play 18",
    location: "Default course",
    notes: "A starter 18-hole card so you can begin scoring as soon as the app is installed.",
    holeCount: 18,
    holes: createDefaultCourseHoles(),
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  await db.courses.put(course);
  return course;
}
