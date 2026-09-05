import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductRedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  redirect(`/setting/${resolvedParams.id}`);
}
