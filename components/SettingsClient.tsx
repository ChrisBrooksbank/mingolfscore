"use client";

import { useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { db } from "@/lib/db";
import type { Course, Player, Round } from "@/lib/types";

type Backup = {
  players?: Player[];
  courses?: Course[];
  rounds?: Round[];
};

function parseBackup(text: string): Backup {
  const payload: unknown = JSON.parse(text);
  if (!payload || typeof payload !== "object") throw new Error("Not a backup file");
  const { players, courses, rounds } = payload as Record<string, unknown>;
  const isRecordList = (value: unknown) =>
    value === undefined ||
    (Array.isArray(value) && value.every((item) => item && typeof item === "object" && typeof (item as { id?: unknown }).id === "string"));
  if (!isRecordList(players) || !isRecordList(courses) || !isRecordList(rounds) || (!players && !courses && !rounds)) {
    throw new Error("Not a backup file");
  }
  return { players, courses, rounds } as Backup;
}

export function SettingsClient() {
  const [message, setMessage] = useState<string | null>(null);

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
    // Revoking synchronously can cancel the download in some browsers.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importData(file: File | null) {
    if (!file) return;
    let payload: Backup;
    try {
      payload = parseBackup(await file.text());
    } catch {
      setMessage("That file is not a Mini Golf Score backup.");
      return;
    }

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
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                // Reset so choosing the same file again still triggers a change.
                event.target.value = "";
                void importData(file);
              }}
            />
          </label>
          <button className="button danger" type="button" onClick={clearData}>
            <Trash2 size={18} /> Clear local data
          </button>
        </div>
        {message ? <p className="muted" role="alert">{message}</p> : null}
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
