import {Contribution} from "@/app/types";
import ContributionCard from "@/app/components/contribution-card";

export const statusConfig = {
  Complete: {
    color: 'bg-gray-100 text-gray-800',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
    )
  },
  Active: {
    color: 'bg-green-100 text-green-800',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
        </svg>
    )
  },
  Scheduled: {
    color: 'bg-blue-100 text-blue-800',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        </svg>
    )
  }
};


export type ContributionStatus = 'Complete' | 'Active' | 'Scheduled';

function getContributionStatus(startTime: string, endTime: string): ContributionStatus {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now > end) return 'Complete';
  if (now >= start && now <= end) return 'Active';
  return 'Scheduled';
}

export default function ContributionsList({ contributions }: { contributions: Contribution[] }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contributions.map((contribution) => {
        const status = getContributionStatus(contribution.startTime, contribution.endTime);

        return (
            <div
                key={contribution.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <ContributionCard contribution={contribution} status={status} />
            </div>
        );
      })}

    </div>
  );
}