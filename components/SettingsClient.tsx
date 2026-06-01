"use client";

import { Download, Trash2, Upload } from "lucide-react";
import { db } from "@/lib/db";
import type { Course, Player, Round } from "@/lib/types";

export function SettingsClient() {
  async function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      players: await db.players.toArray(),
      courses: await db.courses.toArray(),
      rounds: await db.rounds.toArray(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mini-golf-score-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importData(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const payload = JSON.parse(text) as {
      players?: Player[];
      courses?: Course[];
      rounds?: Round[];
    };

    await db.transaction("rw", db.players, db.courses, db.rounds, async () => {
      if (payload.players) await db.players.bulkPut(payload.players);
      if (payload.courses) await db.courses.bulkPut(payload.courses);
      if (payload.rounds) await db.rounds.bulkPut(payload.rounds);
    });
    window.location.reload();
  }

  async function clearData() {
    const confirmed = window.confirm("Delete all local players, courses, and rounds?");
    if (!confirmed) return;
    await db.transaction("rw", db.players, db.courses, db.rounds, async () => {
      await db.players.clear();
      await db.courses.clear();
      await db.rounds.clear();
    });
    window.location.href = "/";
  }

  return (
    <section className="section">
      <div>
        <h1>Settings</h1>
        <p className="lede">Manage offline data, backups, and app updates.</p>
      </div>

      <div className="panel form">
        <h2>Data</h2>
        <div className="button-row">
          <button className="button" type="button" onClick={exportData}>
            <Download size={18} /> Export backup
          </button>
          <label className="button">
            <Upload size={18} /> Import backup
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={(event) => importData(event.target.files?.[0] ?? null)}
            />
          </label>
          <button className="button danger" type="button" onClick={clearData}>
            <Trash2 size={18} /> Clear local data
          </button>
        </div>
      </div>

      <div className="panel">
        <h2>PWA</h2>
        <p className="muted">
          The app is installable on supported devices and keeps the scoring shell available offline.
          New production builds show an update prompt when the service worker detects a fresh version.
        </p>
      </div>
    </section>
  );
}
