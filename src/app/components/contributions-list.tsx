import {Contribution} from "@/app/types";

interface ContributionsListProps {
  contributions: Contribution[];
}

export default function ContributionsList({ contributions }: ContributionsListProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contributions.map((contribution) => (
        <div 
          key={contribution.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">{contribution.title}</h3>
        </div>
      ))}
    </div>
  );
}