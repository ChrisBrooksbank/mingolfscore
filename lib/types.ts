export type Player = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};

export type Hole = {
  number: number;
  name?: string;
  par: number;
};

export type Course = {
  id: string;
  name: string;
  location?: string;
  notes?: string;
  holeCount: number;
  holes: Hole[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type CourseSnapshot = {
  name: string;
  location?: string;
  holeCount: number;
  holes: Hole[];
};

export type RoundPlayer = {
  id: string;
  name: string;
  color: string;
};

export type ScoreEntry = {
  playerId: string;
  holeNumber: number;
  strokes: number | null;
  updatedAt: string;
};

export type Round = {
  id: string;
  courseId?: string;
  courseSnapshot: CourseSnapshot;
  players: RoundPlayer[];
  scores: ScoreEntry[];
  status: "draft" | "active" | "complete" | "archived";
  currentHole: number;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
};

export type PlayerTotal = {
  player: RoundPlayer;
  total: number;
  scoredHoles: number;
  parDelta: number;
  holeInOnes: number;
  rank: number;
  complete: boolean;
};

export type RoundAward = {
  title: string;
  detail: string;
};
