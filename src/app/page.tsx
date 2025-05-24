import ContributionsList from "@/app/components/contributions-list";

interface HomeProps {
  searchParams?: {
    title?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  const searchTerm = searchParams?.title || "";

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ContributionsList searchTerm={searchTerm} />
      </main>
    </div>
  );
}