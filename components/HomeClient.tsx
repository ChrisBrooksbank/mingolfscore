"use client";

import Link from "next/link";
import { Flag, History, MapPin, Trophy } from "lucide-react";
import { useCourses, useRounds } from "@/lib/hooks";
import { sortedTotals } from "@/lib/scoring";

export function HomeClient() {
  const rounds = useRounds();
  const courses = useCourses();
  const activeRound = rounds.find((round) => round.status === "active");
  const completed = rounds.filter((round) => round.status === "complete");
  const lastRound = completed[0];
  const lastWinner = lastRound ? sortedTotals(lastRound)[0] : null;

  return (
    <>
      <section className="hero">
        <h1>Score the round in your hand.</h1>
        <p>
          Fast mini golf scoring with saved courses, flexible players and holes, offline recovery,
          round history, and share-ready results.
        </p>
        <div className="button-row">
          <Link className="button primary" href={activeRound ? `/round/${activeRound.id}` : "/new"}>
            <Flag size={18} /> {activeRound ? "Resume Round" : "Start Round"}
          </Link>
          <Link className="button" href="/courses/new">
            <MapPin size={18} /> Add Course
          </Link>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <div className="stat">
            <span className="muted">Rounds played</span>
            <strong>{completed.length}</strong>
          </div>
        </div>
        <div className="panel">
          <div className="stat">
            <span className="muted">Saved courses</span>
            <strong>{courses.length}</strong>
          </div>
        </div>
        <div className="panel">
          <div className="stat">
            <span className="muted">Last winner</span>
            <strong>{lastWinner?.player.name ?? "None yet"}</strong>
          </div>
        </div>
      </section>

      {activeRound ? (
        <section className="section">
          <div className="section-head">
            <div>
              <h2>Round in progress</h2>
              <p className="muted">{activeRound.courseSnapshot.name}</p>
            </div>
            <Link className="button primary" href={`/round/${activeRound.id}`}>
              Continue
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="section-head">
          <h2>Quick actions</h2>
        </div>
        <div className="grid">
          <Link className="card" href="/new">
            <h3>
              <Flag size={18} /> New round
            </h3>
            <p className="muted">Pick players, choose a course, and start scoring.</p>
          </Link>
          <Link className="card" href="/courses">
            <h3>
              <MapPin size={18} /> Courses
            </h3>
            <p className="muted">Create reusable courses with custom holes and pars.</p>
          </Link>
          <Link className="card" href="/history">
            <h3>
              <History size={18} /> History
            </h3>
            <p className="muted">Review results, winners, and old scorecards.</p>
          </Link>
          <Link className="card" href={lastRound ? `/round/${lastRound.id}/results` : "/history"}>
            <h3>
              <Trophy size={18} /> Results
            </h3>
            <p className="muted">Replay the last completed round and awards.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
