import {FilterType} from "@/app/types";


export default function SearchDropdown({ filterType, setFilterType }: { filterType: FilterType, setFilterType: (type: FilterType) => void }) {
  return <div className=" relative inline-flex items-center">
    <select
        className="p-2 pr-6 bg-white text-gray-900 border-y border-l border-[#0F8B8D] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#0F8B8DA0] appearance-none"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as FilterType)}
    >
      <option value="title">Title</option>
      <option value="description">Description</option>
      <option value="owner">Owner</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
}