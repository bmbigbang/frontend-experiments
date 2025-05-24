import {use} from "react";


type ContributionsResponse = {
  contributions: Array<{
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    owner: string;
  }>;
  total: number;
}

const useContributionsData = (): ContributionsResponse => {
  const getContributions = async () => {
    const response = await fetch("http://localhost:8000/contributions/");
    if (!response.ok) {
      throw new Error("Unexpected error occurred when fetching contributions");
    }
    return await response.json();
  }

  return use(getContributions())
}

export default useContributionsData;