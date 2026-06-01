import { RoundScoringClient } from "@/components/RoundScoringClient";

export default async function Page({ params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params;
  return <RoundScoringClient roundId={roundId} />;
}
