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

  const applyFilters = () => {
    const params = new URLSearchParams();

    // Add text-based filters from activeFilters state
    activeFilters.forEach(filter => {
      params.set(filter.type, filter.value);
    });

    // Add the current input value as a filter if it exists
    if (inputValue.trim() !== '') {
      params.set(filterType, inputValue.trim());
    }

    // Add date range filters
    if (pendingDateRange.startAfter) {
      params.set('startAfter', pendingDateRange.startAfter);
    }
    if (pendingDateRange.endBefore) {
      params.set('endBefore', pendingDateRange.endBefore);
    }
    
    // Update the actual dateRange state
    setDateRange(pendingDateRange);

    // Navigate to the new URL
    router.push(`/?${params.toString()}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Update the active filters state with the new input,
    // and let applyFilters handle the URL navigation.
    const newFilter: Filter = { type: filterType, value: inputValue.trim() };
    setActiveFilters(prev => {
      const filtered = prev.filter(filter => filter.type !== filterType);
      return [...filtered, newFilter];
    });
    
    // Reset the input
    setInputValue('');
    
    applyFilters();
  };

  const handleDateChange = (field: keyof DateRangeFilter, value: string) => {
    setPendingDateRange(prev => ({
      ...prev,
      [field]: value
    }));
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
          onClick={applyFilters}
          className="ml-auto px-4 py-2 bg-[#6184d8] text-white rounded-md hover:bg-[#6184d8A4] transition-colors cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}