
interface DateRangeFilterProps {
  startAfter: string;
  endBefore: string;
  onDateChange: (field: 'startAfter' | 'endBefore', value: string) => void;
}

export default function DateRangeFilter({ startAfter, endBefore, onDateChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div>
        <label htmlFor="startAfter" className="text-sm text-gray-600 block sm:inline-block sm:mr-1">From:</label>
        <input
          id="startAfter"
          type="date"
          className="px-2 py-2 bg-white text-gray-900 border border-[#0F8B8D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F8B8DA0]"
          value={startAfter}
          onChange={(e) => onDateChange('startAfter', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endBefore" className="text-sm text-gray-600 block sm:inline-block sm:mr-1">To:</label>
        <input
          id="endBefore"
          type="date"
          className="px-2 py-2 bg-white text-gray-900 border border-[#0F8B8D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F8B8DA0]"
          value={endBefore}
          onChange={(e) => onDateChange('endBefore', e.target.value)}
        />
      </div>
    </div>
  );
}