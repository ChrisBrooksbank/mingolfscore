"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createDefaultHoles, parseBoundedInt } from "@/lib/scoring";
import { db, nowIso, playerColor, uid } from "@/lib/db";
import { DEFAULT_COURSE_ID } from "@/lib/defaultCourse";
import { useCourses, usePlayers } from "@/lib/hooks";
import type { Course, Player, Round, RoundPlayer } from "@/lib/types";

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function isPlaceholderName(name: string) {
  return /^player \d+$/i.test(name.trim());
}

function NewRoundInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courses = useCourses();
  const savedPlayers = usePlayers();
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get("course") ?? DEFAULT_COURSE_ID);
  const [courseName, setCourseName] = useState("New Course");
  const [holeCount, setHoleCount] = useState(18);
  const [defaultPar, setDefaultPar] = useState(3);
  const [saveCourse, setSaveCourse] = useState(true);
  const [players, setPlayers] = useState<RoundPlayer[]>([
    { id: uid(), name: "Player 1", color: playerColor(0) },
    { id: uid(), name: "Player 2", color: playerColor(1) },
  ]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [courses, selectedCourseId],
  );

  useEffect(() => {
    if (selectedCourse) {
      setCourseName(selectedCourse.name);
      setHoleCount(selectedCourse.holeCount);
    }
  }, [selectedCourse]);

  const suggestedPlayers = useMemo(() => {
    const taken = new Set(players.map((player) => normalizeName(player.name)));
    const unique = new Map<string, Player>();
    for (const player of savedPlayers) {
      const key = normalizeName(player.name);
      if (!key || taken.has(key) || isPlaceholderName(player.name) || unique.has(key)) continue;
      unique.set(key, player);
    }
    return [...unique.values()].slice(0, 6);
  }, [players, savedPlayers]);

  function updatePlayer(id: string, name: string) {
    setPlayers((current) =>
      current.map((player) => (player.id === id ? { ...player, name } : player)),
    );
  }

  function addPlayer(name?: string) {
    setPlayers((current) => [
      ...current,
      { id: uid(), name: name || `Player ${current.length + 1}`, color: playerColor(current.length) },
    ]);
  }

  function removePlayer(id: string) {
    setPlayers((current) => (current.length <= 1 ? current : current.filter((player) => player.id !== id)));
  }

  async function startRound() {
    const cleanPlayers = players
      .map((player, index) => ({
        ...player,
        name: player.name.trim() || `Player ${index + 1}`,
      }))
      .filter((player) => player.name);

    if (cleanPlayers.length === 0) return;

    const now = nowIso();
    let course: Course | undefined = selectedCourse;

    if (!course) {
      const holes = createDefaultHoles(holeCount, defaultPar);
      course = {
        id: uid(),
        name: courseName.trim() || "Custom Course",
        holeCount,
        holes,
        status: "active",
        createdAt: now,
        updatedAt: now,
      };
      if (saveCourse) {
        await db.courses.put(course);
      }
    }

    // Reuse saved player records by name so the registry does not fill up with duplicates,
    // and skip placeholder names like "Player 2".
    const savedByName = new Map(savedPlayers.map((player) => [normalizeName(player.name), player]));
    const usedIds = new Set<string>();
    const roundPlayers: RoundPlayer[] = cleanPlayers.map((player) => {
      const existing = savedByName.get(normalizeName(player.name));
      if (existing && !usedIds.has(existing.id)) {
        usedIds.add(existing.id);
        return { ...player, id: existing.id, name: existing.name };
      }
      return player;
    });

    const playersToSave: Player[] = roundPlayers
      .filter((player) => !usedIds.has(player.id) && !isPlaceholderName(player.name))
      .map((player) => ({
        id: player.id,
        name: player.name,
        color: player.color,
        createdAt: now,
      }));

    if (playersToSave.length > 0) {
      await db.players.bulkPut(playersToSave);
    }

    const round: Round = {
      id: uid(),
      courseId: saveCourse || selectedCourse ? course.id : undefined,
      courseSnapshot: {
        name: course.name,
        location: course.location,
        holeCount: course.holeCount,
        holes: course.holes,
      },
      players: roundPlayers,
      scores: [],
      status: "active",
      currentHole: 1,
      startedAt: now,
      updatedAt: now,
    };

    await db.rounds.put(round);
    router.push(`/round/${round.id}`);
  }

  return (
    <section className="section">
      <div>
        <h1>New Round</h1>
        <p className="lede">Choose the players and course, then score hole by hole.</p>
      </div>

      <div className="panel form">
        <h2>Players</h2>
        {players.map((player, index) => (
          <div className="player-score" key={player.id}>
            <div className="player-name">
              <span className="dot" style={{ background: player.color }} />
              <input
                className="input"
                value={player.name}
                aria-label={`Player ${index + 1} name`}
                onChange={(event) => updatePlayer(player.id, event.target.value)}
              />
            </div>
            <button className="icon-button" type="button" onClick={() => removePlayer(player.id)}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <div className="button-row">
          <button className="button" type="button" onClick={() => addPlayer()}>
            <Plus size={18} /> Add player
          </button>
          {suggestedPlayers.map((player) => (
            <button className="pill" type="button" key={player.id} onClick={() => addPlayer(player.name)}>
              {player.name}
            </button>
          ))}
        </div>
      </div>

      <div className="panel form">
        <h2>Course</h2>
        <div className="field">
          <label htmlFor="course-select">Saved course</label>
          <select
            id="course-select"
            className="select"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
          >
            <option value="custom">Custom course</option>
            {courses.map((course) => (
              <option value={course.id} key={course.id}>
                {course.name} ({course.holeCount})
              </option>
            ))}
          </select>
        </div>

        {!selectedCourse ? (
          <>
            <div className="grid">
              <div className="field">
                <label htmlFor="course-name">Course name</label>
                <input
                  id="course-name"
                  className="input"
                  value={courseName}
                  onChange={(event) => setCourseName(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="hole-count">Holes</label>
                <input
                  id="hole-count"
                  className="input"
                  type="number"
                  min={1}
                  max={36}
                  value={holeCount}
                  onChange={(event) => {
                    const count = parseBoundedInt(event.target.value, 1, 36);
                    if (count !== null) setHoleCount(count);
                  }}
                />
              </div>
              <div className="field">
                <label htmlFor="default-par">Default par</label>
                <input
                  id="default-par"
                  className="input"
                  type="number"
                  min={1}
                  max={9}
                  value={defaultPar}
                  onChange={(event) => {
                    const par = parseBoundedInt(event.target.value, 1, 9);
                    if (par !== null) setDefaultPar(par);
                  }}
                />
              </div>
            </div>
            <label className="pill">
              <input
                type="checkbox"
                checked={saveCourse}
                onChange={(event) => setSaveCourse(event.target.checked)}
              />
              Save this course
            </label>
          </>
        ) : (
          <div className="pill-list">
            <span className="pill">{selectedCourse.holeCount} holes</span>
            <span className="pill">Par {selectedCourse.holes.reduce((sum, hole) => sum + hole.par, 0)}</span>
          </div>
        )}

        <button className="button primary" type="button" onClick={startRound}>
          Start scoring
        </button>
      </div>
    </section>
  );
}

export function NewRoundClient() {
  return (
    <Suspense fallback={<div className="panel">Loading round setup...</div>}>
      <NewRoundInner />
    </Suspense>
  );
}
