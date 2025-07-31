import { Suspense } from "react";
import PersonalizeClient from "@/components/PersonalizeComponents/PersonalizeClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonalizeClient />
    </Suspense>
  );
}
