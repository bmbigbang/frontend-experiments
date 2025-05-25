import Link from 'next/link';

type PaginationParams = {
  itemsPerPage: number;
  title?: string;
  total: number;
  page: number;
  startBefore?: string;
  startAfter?: string;
}

export default function Pagination({ page, itemsPerPage, startAfter, startBefore, total, title }
    : PaginationParams) {

  const totalPages = Math.ceil(total / itemsPerPage);

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (startBefore) params.set('startBefore', startBefore);
    if (startAfter) params.set('startAfter', startAfter);
    params.set('page', pageNum.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-2 w-full">
      <Link
        href={page > 1 ? createPageUrl(page - 1) : '#'}
        className={"ml-2 px-4 py-2 bg-[#6184d8] text-white rounded-md " +
            (page > 1 ? 'hover:bg-[#6184d8A4]' : '')}
      >
        Previous
      </Link>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={createPageUrl(pageNum)}
          className={`ml-2 px-4 py-2  text-white rounded-md  ${
            pageNum === page ? 'bg-[#0F8B8D]' : 'bg-[#6184d8] hover:bg-[#6184d8A4]'
          }`}
        >
          {pageNum}
        </Link>
      ))}

      <Link
        href={page < totalPages ? createPageUrl(page + 1) : '#'}
        className={"ml-2 px-4 py-2 bg-[#6184d8] text-white rounded-md " +
          (page < totalPages ? 'hover:bg-[#6184d8A4]' : '')}

      >
        Next
      </Link>
    </div>
  );
}