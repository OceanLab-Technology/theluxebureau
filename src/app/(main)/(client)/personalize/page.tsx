import { Suspense } from "react";
import PersonalizeClient from "@/components/PersonalizeComponents/PersonalizeClient";
import { PersonalizeSkeleton } from "@/components/PersonalizeComponents/PersonalizeSkeleton";

export default function Page() {
  return (
    // <Suspense fallback={<PersonalizeSkeleton />}>
      <PersonalizeClient />
    // </Suspense>
  );
}