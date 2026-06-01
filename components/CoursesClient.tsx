"use client";

import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { useCourses, useRounds } from "@/lib/hooks";

export function CoursesClient() {
  const courses = useCourses(true);
  const rounds = useRounds();

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h1>Courses</h1>
          <p className="lede">Build reusable scorecards for every mini golf course you play.</p>
        </div>
        <Link className="button primary" href="/courses/new">
          <Plus size={18} /> Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="panel">
          <h2>No courses yet</h2>
          <p className="muted">Add your first course with custom holes and pars.</p>
        </div>
      ) : (
        <div className="grid">
          {courses.map((course) => {
            const courseRounds = rounds.filter((round) => round.courseId === course.id);
            return (
              <Link className="card" href={`/courses/${course.id}`} key={course.id}>
                <h3>
                  <MapPin size={18} /> {course.name}
                </h3>
                <p className="muted">
                  {course.location || "No location"} · {course.holeCount} holes · {courseRounds.length} rounds
                </p>
                {course.status === "archived" ? <span className="pill">Archived</span> : null}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
