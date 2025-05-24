import ContributionsList from "@/app/components/contributions-list";
import {Suspense, use} from "react";
import Spinner from "@/app/components/spinner";
import Pagination from "@/app/components/pagination";
import {getContributions} from "@/app/hooks/get-contributions";


interface HomeProps {
  searchParams: {
    title?: string;
    page: string;
    startBefore?: string;
    startAfter?: string;
  };
}

const itemsPerPage = 14;

export default function Home({ searchParams }: HomeProps) {
  const { title, page, startBefore, startAfter } = searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const skip = (currentPage - 1) * itemsPerPage;
  const { contributions, total } = use(getContributions({
    limit: itemsPerPage,
    skip,
    startBefore,
    startAfter,
    title,
  }));


  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen pt-8 pb-20 px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-start sm:items-start w-full">
        <Suspense fallback={<Spinner />}>
          {total > 1 && (
              <Pagination
                  page={currentPage}
                  total={total}
                  itemsPerPage={itemsPerPage}
                  title={title}
              />
          )}
          <ContributionsList 
            searchTerm={title || ""}
            contributions={contributions}
          />
        </Suspense>
      </main>
    </div>
  );
}