import {DateRangeFilter} from "@/app/components/search-bar";
import {useRouter, useSearchParams} from "next/navigation";
import CrossIcon from "@/app/components/cross-icon";

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
              className="ml-2 text-[#6184d8] hover:text-[#6184d8A4] focus:outline-none"
              aria-label="Remove date range filter"
          >
            <CrossIcon />
          </button>
        </div>
    )}
  </>
}