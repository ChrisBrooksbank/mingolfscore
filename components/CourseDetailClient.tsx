"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flag, Pencil } from "lucide-react";
import { CourseForm } from "@/components/CourseForm";
import { db } from "@/lib/db";
import { useRounds } from "@/lib/hooks";
import { sortedTotals } from "@/lib/scoring";
import type { Course } from "@/lib/types";

export function CourseDetailClient({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [editing, setEditing] = useState(false);
  const rounds = useRounds();

  useEffect(() => {
    db.courses.get(courseId).then((item) => setCourse(item ?? null));
  }, [courseId, editing]);

  if (!course) {
    return (
      <section className="section">
        <div className="panel">Course not found.</div>
      </section>
    );
  }

  if (editing) {
    return <CourseForm initialCourse={course} />;
  }

  const courseRounds = rounds.filter((round) => round.courseId === course.id && round.status === "complete");
  const best = courseRounds
    .flatMap((round) => sortedTotals(round).map((total) => ({ round, total })))
    .sort((a, b) => a.total.total - b.total.total)[0];

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h1>{course.name}</h1>
          <p className="lede">
            {course.location || "No location"} · {course.holeCount} holes
          </p>
        </div>
        <div className="button-row">
          <Link className="button primary" href={`/new?course=${course.id}`}>
            <Flag size={18} /> Play
          </Link>
          <button className="button" type="button" onClick={() => setEditing(true)}>
            <Pencil size={18} /> Edit
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="panel stat">
          <span className="muted">Rounds played</span>
          <strong>{courseRounds.length}</strong>
        </div>
        <div className="panel stat">
          <span className="muted">Best score</span>
          <strong>{best ? best.total.total : "None"}</strong>
        </div>
      </div>

      <div className="table-wrap">
        <table className="score-table">
          <thead>
            <tr>
              <th>Hole</th>
              <th>Name</th>
              <th>Par</th>
            </tr>
          </thead>
          <tbody>
            {course.holes.map((hole) => (
              <tr key={hole.number}>
                <td>Hole {hole.number}</td>
                <td>{hole.name || "Untitled"}</td>
                <td>{hole.par}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {course.notes ? <div className="panel">{course.notes}</div> : null}
    </section>
  );
}
