import ContributionsList from "@/app/components/contributions-list";
import {Suspense, use} from "react";
import Spinner from "@/app/components/spinner";
import Pagination from "@/app/components/pagination";
import {getContributions} from "@/app/hooks/get-contributions";


type SearchParams = {
  title?: string;
  description?: string;
  owner?: string;
  page?: string;
  endBefore?: string;
  startAfter?: string;
}

const itemsPerPage = 14;

export default function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { title, description, owner, page, endBefore, startAfter } = (use(searchParams)) as SearchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const skip = (currentPage - 1) * itemsPerPage;
  const { contributions, total } = use(getContributions({
    limit: itemsPerPage,
    skip,
    endBefore,
    startAfter,
    title,
    description,
    owner,
  }));


  return (
    <div className={"grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen p-6 " +
        "font-[family-name:var(--font-geist-sans)]"}>
      <main className="flex flex-col gap-[32px] row-start-2 items-start sm:items-start w-full max-w-[80rem]">
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
            contributions={contributions}
          />
        </Suspense>
      </main>
    </div>
  );
}