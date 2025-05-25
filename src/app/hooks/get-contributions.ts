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
  endBefore?: string;
  startAfter?: string;
  title?: string;
  description?: string;
  owner?: string;
}

export async function getContributions({
  skip,
  limit,
  endBefore,
  startAfter,
  title,
  description,
  owner
}: PaginationParams): Promise<ContributionsResponse> {
  const params = new URLSearchParams();

  params.append('skip', skip.toString());
  params.append('limit', limit.toString());

  if (endBefore) params.append('endBefore', endBefore);
  if (startAfter) params.append('startAfter', startAfter);
  if (title) params.append('title', title);
  if (description) params.append('description', description);
  if (owner) params.append('owner', owner);

  const response = await fetch(`http://localhost:8000/contributions/?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Unexpected error occurred when fetching contributions");
  }

  return await response.json();
}