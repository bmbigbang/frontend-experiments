import {Suspense} from "react";
import useContributionsData from "@/app/hooks/useContributionsData";
import Spinner from "@/app/components/spinner";


export default function Home() {
  const { contributions } = useContributionsData();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Suspense fallback={<Spinner />} >
          {contributions.map((c) => JSON.stringify(c))}
        </Suspense>
      </main>
    </div>
  );
}
