import ContributionsList from "@/app/components/contributions-list";
import {Suspense, Usable, use} from "react";
import Spinner from "@/app/components/spinner";

interface HomeProps {
  searchParams: Usable<{
    title?: string;
  }>;
}

export default function Home({ searchParams }: HomeProps) {
  const { title } = use(searchParams);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen pt-8 pb-20 px-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-start sm:items-start">
        <Suspense fallback={<Spinner />} >
          <ContributionsList searchTerm={title || ""} />
        </Suspense>
      </main>
    </div>
  );
}