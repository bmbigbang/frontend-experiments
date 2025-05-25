import CrossIcon from "@/app/components/cross-icon";
import {Filter} from "@/app/types";
import {useRouter, useSearchParams} from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type Props = {
  activeFilters: Filter[];
  setActiveFilters: Dispatch<SetStateAction<Filter[]>>;
}

export default function FilterPills({ activeFilters, setActiveFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const removeFilter = (filterToRemove: Filter) => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());

    // Remove the filter
    params.delete(filterToRemove.type);

    // Update the active filters
    setActiveFilters(prev =>
        prev.filter(filter => filter.type !== filterToRemove.type)
    );

    // Navigate to the new URL
    router.push(`/?${params.toString()}`);
  };

  return <>
    {activeFilters.length > 0 && activeFilters.map((filter, index) => (
        <div
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
        >
          <span className="font-medium mr-1 capitalize">{filter.type}:</span>
          <span>{filter.value}</span>
          <button
              onClick={() => removeFilter(filter)}
              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label={`Remove ${filter.type} filter`}
          >
            <CrossIcon />
          </button>
        </div>
    ))}
  </>
}