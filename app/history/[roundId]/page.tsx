import { ResultsClient } from "@/components/ResultsClient";

export default async function Page({ params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params;
  return <ResultsClient roundId={roundId} />;
}
