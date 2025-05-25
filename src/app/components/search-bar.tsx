'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {FormEvent, useEffect, useState} from 'react';
import {Filter, FilterType} from "@/app/types";
import SearchDropdown from "@/app/components/search-dropdown";
import DateRangeFilter from "@/app/components/date-range-filter";
import DateRangePill from "@/app/components/date-range-pill";
import CrossIcon from "@/app/components/cross-icon";
import FilterPills from "@/app/components/filter-pills";

export interface DateRangeFilter {
  startAfter: string;
  endBefore: string;
}

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current search parameters
  const currentTitle = searchParams.get('title') || '';
  const currentDescription = searchParams.get('description') || '';
  const currentOwner = searchParams.get('owner') || '';
  const currentStartAfter = searchParams.get('startAfter') || '';
  const currentEndBefore = searchParams.get('endBefore') || '';

  // State for the search input and filter type
  const [inputValue, setInputValue] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('title');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startAfter: currentStartAfter,
    endBefore: currentEndBefore
  });
  const [pendingDateRange, setPendingDateRange] = useState<DateRangeFilter>({
    startAfter: currentStartAfter,
    endBefore: currentEndBefore
  });

  // Initialize active filters from URL parameters
  useEffect(() => {
    const filters: Filter[] = [];
    if (currentTitle) filters.push({ type: 'title', value: currentTitle });
    if (currentDescription) filters.push({ type: 'description', value: currentDescription });
    if (currentOwner) filters.push({ type: 'owner', value: currentOwner });
    setActiveFilters(filters);
    
    setDateRange({
      startAfter: currentStartAfter,
      endBefore: currentEndBefore
    });
    setPendingDateRange({ // Initialize pending date range as well
      startAfter: currentStartAfter,
      endBefore: currentEndBefore
    });
  }, [currentTitle, currentDescription, currentOwner, currentStartAfter, currentEndBefore]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());
    
    // Add the new filter
    if (filterType) {
      params.set(filterType, inputValue);
      
      // Update the active filters
      const newFilter: Filter = { type: filterType, value: inputValue };
      setActiveFilters(prev => {
        // Remove an existing filter of the same type if it exists
        const filtered = prev.filter(filter => filter.type !== filterType);
        return [...filtered, newFilter];
      });
    }
    
    // Reset the input
    setInputValue('');
    
    // Navigate to the new URL
    router.push(`/?${params.toString()}`);
  };

  const handleDateChange = (field: keyof DateRangeFilter, value: string) => {
    setPendingDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyDateRangeFilters = () => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());

    // Update URL params for date filtering based on pendingDateRange
    if (pendingDateRange.startAfter) {
      params.set('startAfter', pendingDateRange.startAfter);
    } else {
      params.delete('startAfter');
    }
    if (pendingDateRange.endBefore) {
      params.set('endBefore', pendingDateRange.endBefore);
    } else {
      params.delete('endBefore');
    }
    
    // Update the actual dateRange state
    setDateRange(pendingDateRange);

    // Navigate to the new URL which will trigger data fetch
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSubmit} className="flex-1 flex">
          <SearchDropdown filterType={filterType} setFilterType={setFilterType} />
          <input
            name="searchTerm"
            type="text"
            placeholder={`Search by ${filterType || 'title'}...`}
            className="flex-1 px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-[#0F8B8D] rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#0F8B8DA0]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
        
        <DateRangeFilter
          startAfter={pendingDateRange.startAfter}
          endBefore={pendingDateRange.endBefore}
          onDateChange={handleDateChange}
        />
      </div>
      
      {/* Active filters pills */}
      <div className="mt-3 flex flex-wrap gap-2">
        <FilterPills activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
        
        <DateRangePill dateRange={dateRange} setDateRange={setDateRange} />
        
        {(activeFilters.length > 0 || dateRange.startAfter || dateRange.endBefore) && (
          <button
            onClick={() => {
              router.push('/');
              setActiveFilters([]);
              setDateRange({ startAfter: '', endBefore: '' });
              setPendingDateRange({ startAfter: '', endBefore: '' });
            }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
          >
            Clear all filters <div className="pl-1"><CrossIcon /></div>
          </button>
        )}

        <button
          onClick={applyDateRangeFilters}
          className="ml-auto px-4 py-2 bg-[#6184d8] text-white rounded-md hover:bg-[#6184d8A4] transition-colors cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}