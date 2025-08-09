import { Suspense } from "react";
import PersonaliseClient from "@/components/PersonaliseComponents/PersonaliseClient";
import { PersonaliseSkeleton } from "@/components/PersonaliseComponents/PersonaliseSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PersonaliseSkeleton />}>
      <PersonaliseClient />
    </Suspense>
  );
}
