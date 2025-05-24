'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const currentSearchTitle = searchParams.get('title');


  const [inputValue, setInputValue] = useState(currentSearchTitle || '');

  useEffect(() => {
    setInputValue(currentSearchTitle || '');
  }, [currentSearchTitle]);

  return (
    <form method="GET" action="/" className="flex justify-center">
      <input
        type="search"
        name="title"
        placeholder="Search contributions by title..."
        className="w-100 px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-[#0F8B8D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F8B8DA0]"        value={inputValue} // Controlled component
        onChange={(e) => setInputValue(e.target.value)} // Update state on change
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
}