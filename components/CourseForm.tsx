"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Save, Trash2 } from "lucide-react";
import { createDefaultHoles } from "@/lib/scoring";
import type { Course, Hole } from "@/lib/types";
import { db, nowIso, uid } from "@/lib/db";

type Props = {
  initialCourse?: Course;
};

export function CourseForm({ initialCourse }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialCourse?.name ?? "");
  const [location, setLocation] = useState(initialCourse?.location ?? "");
  const [notes, setNotes] = useState(initialCourse?.notes ?? "");
  const [holeCount, setHoleCount] = useState(initialCourse?.holeCount ?? 18);
  const [holes, setHoles] = useState<Hole[]>(initialCourse?.holes ?? createDefaultHoles(18, 3));

  const visibleHoles = useMemo(() => holes.slice(0, holeCount), [holes, holeCount]);

  function changeHoleCount(nextCount: number) {
    const count = Math.max(1, Math.min(36, nextCount));
    setHoleCount(count);
    setHoles((current) => {
      const next = [...current];
      for (let index = current.length; index < count; index += 1) {
        next.push({ number: index + 1, par: 3 });
      }
      return next.map((hole, index) => ({ ...hole, number: index + 1 }));
    });
  }

  function updateHole(index: number, patch: { name?: string; par?: number }) {
    setHoles((current) =>
      current.map((hole, holeIndex) =>
        holeIndex === index
          ? {
              ...hole,
              name: patch.name ?? hole.name,
              par: patch.par ?? hole.par,
            }
          : hole,
      ),
    );
  }

  async function saveCourse() {
    if (!name.trim()) return;
    const now = nowIso();
    const course: Course = {
      id: initialCourse?.id ?? uid(),
      name: name.trim(),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      holeCount,
      holes: visibleHoles,
      status: initialCourse?.status ?? "active",
      createdAt: initialCourse?.createdAt ?? now,
      updatedAt: now,
    };
    await db.courses.put(course);
    router.push(`/courses/${course.id}`);
  }

  async function archiveCourse() {
    if (!initialCourse) return;
    await db.courses.put({ ...initialCourse, status: "archived", updatedAt: nowIso() });
    router.push("/courses");
  }

  async function duplicateCourse() {
    if (!initialCourse) return;
    const now = nowIso();
    const copy: Course = {
      ...initialCourse,
      id: uid(),
      name: `${initialCourse.name} copy`,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    await db.courses.put(copy);
    router.push(`/courses/${copy.id}`);
  }

  return (
    <section className="section">
      <div>
        <h1>{initialCourse ? "Edit Course" : "Add Course"}</h1>
        <p className="lede">Save the course once, then reuse it every time you play.</p>
      </div>

      <div className="panel form">
        <div className="grid">
          <div className="field">
            <label htmlFor="course-name">Course name</label>
            <input
              id="course-name"
              className="input"
              value={name}
              placeholder="Pirate Cove"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="course-location">Location</label>
            <input
              id="course-location"
              className="input"
              value={location}
              placeholder="Brighton"
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
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
            onChange={(event) => changeHoleCount(Number(event.target.value))}
          />
        </div>

        <div className="grid">
          {visibleHoles.map((hole, index) => (
            <div className="card" key={hole.number}>
              <h3>Hole {hole.number}</h3>
              <div className="field">
                <label htmlFor={`hole-name-${hole.number}`}>Name</label>
                <input
                  id={`hole-name-${hole.number}`}
                  className="input"
                  value={hole.name ?? ""}
                  placeholder="Windmill"
                  onChange={(event) => updateHole(index, { name: event.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor={`hole-par-${hole.number}`}>Par</label>
                <input
                  id={`hole-par-${hole.number}`}
                  className="input"
                  type="number"
                  min={1}
                  max={9}
                  value={hole.par}
                  onChange={(event) => updateHole(index, { par: Number(event.target.value) })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className="textarea"
            value={notes}
            placeholder="Good for rainy days, tricky loop on hole 7..."
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div className="button-row">
          <button className="button primary" type="button" onClick={saveCourse} disabled={!name.trim()}>
            <Save size={18} /> Save course
          </button>
          {initialCourse ? (
            <>
              <button className="button" type="button" onClick={duplicateCourse}>
                <Trash2 size={18} /> Duplicate
              </button>
              <button className="button danger" type="button" onClick={archiveCourse}>
                <Archive size={18} /> Archive
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
