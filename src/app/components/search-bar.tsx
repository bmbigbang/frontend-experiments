'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {FormEvent, useEffect, useState} from 'react';
import {FilterType} from "@/app/types";
import SearchDropdown from "@/app/components/search-dropdown";
import DateRangeFilter from "@/app/components/date-range-filter";
import DateRangePill from "@/app/components/date-range-pill";

interface Filter {
  type: FilterType;
  value: string;
}

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
    const newDateRange = { 
      ...dateRange, 
      [field]: value 
    };
    
    // Update state
    setDateRange(newDateRange);
    
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update URL params for date filtering
    if (value) {
      params.set(field, value);
    } else {
      params.delete(field);
    }
    
    // Navigate to the new URL which will trigger data fetch
    router.push(`/?${params.toString()}`);
  };

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
          startAfter={dateRange.startAfter}
          endBefore={dateRange.endBefore}
          onDateChange={handleDateChange}
        />
      </div>
      
      {/* Active filters pills */}
      <div className="mt-3 flex flex-wrap gap-2">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        
        <DateRangePill dateRange={dateRange} setDateRange={setDateRange} />
        
        {(activeFilters.length > 0 || dateRange.startAfter || dateRange.endBefore) && (
          <button
            onClick={() => {
              router.push('/');
              setActiveFilters([]);
              setDateRange({ startAfter: '', endBefore: '' });
            }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}