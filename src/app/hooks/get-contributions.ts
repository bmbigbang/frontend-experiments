import {Contribution} from "@/app/types";

interface ContributionsResponse {
  contributions: Contribution[];
  total: number;
  skip: number;
  limit: number;
}

interface PaginationParams {
  skip: number;
  limit: number;
  startBefore?: string;
  startAfter?: string;
  title?: string;
}

export async function getContributions({
  skip,
  limit,
  startBefore,
  startAfter,
                                         title
}: PaginationParams): Promise<ContributionsResponse> {
  const params = new URLSearchParams();

  params.append('skip', skip.toString());
  params.append('limit', limit.toString());

  if (startBefore) params.append('startBefore', startBefore);
  if (startAfter) params.append('startAfter', startAfter);
  if (title) params.append('title', title);

  const response = await fetch(`http://localhost:8000/contributions/?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Unexpected error occurred when fetching contributions");
  }

  return await response.json();
}
