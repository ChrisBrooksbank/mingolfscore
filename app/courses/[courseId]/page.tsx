import { CourseDetailClient } from "@/components/CourseDetailClient";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CourseDetailClient courseId={courseId} />;
}
