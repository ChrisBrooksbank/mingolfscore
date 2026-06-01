import { ScoreboardClient } from "@/components/ScoreboardClient";

export default async function Page({ params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params;
  return <ScoreboardClient roundId={roundId} />;
}
