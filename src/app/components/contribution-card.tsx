import {Contribution} from "@/app/types";
import {ContributionStatus, statusConfig} from "@/app/components/contributions-list";

export default function ContributionCard({ contribution, status }: { contribution: Contribution, status: ContributionStatus }) {
  return <>

      <div className="p-6">
        {/* Status Badge with Icon */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${statusConfig[status].color}`}>
          {statusConfig[status].icon}
          {status}
        </div>


        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {contribution.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {contribution.description}
        </p>

        {/* Time Information */}
        <div className="space-y-2 mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Start: </span>
            {new Date(contribution.startTime).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">End: </span>
            {new Date(contribution.endTime).toLocaleString()}
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {contribution.owner.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {contribution.owner}
            </p>
          </div>
        </div>
      </div>
  </>
}