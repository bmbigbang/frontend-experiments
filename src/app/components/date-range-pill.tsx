import {DateRangeFilter} from "@/app/components/search-bar";
import {useRouter, useSearchParams} from "next/navigation";

type Props = { dateRange: DateRangeFilter, setDateRange: (dateRange: DateRangeFilter) => void };

export default function DateRangePill({ dateRange, setDateRange } : Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearDateRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('startAfter');
    params.delete('endBefore');
    setDateRange({ startAfter: '', endBefore: '' });
    router.push(`/?${params.toString()}`);
  };

  return <>
    {(dateRange.startAfter || dateRange.endBefore) && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          <span className="font-medium mr-1">Date range:</span>
          <span>
              {dateRange.startAfter ? `After ${dateRange.startAfter}` : ''}
            {dateRange.startAfter && dateRange.endBefore ? ' & ' : ''}
            {dateRange.endBefore ? `Before ${dateRange.endBefore}` : ''}
            </span>
          <button
              onClick={clearDateRange}
              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label="Remove date range filter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
    )}
  </>
}