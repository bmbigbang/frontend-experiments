import {use} from "react";
import {Contribution, ContributionsResponse} from "@/app/types";


const useContributionsData = (searchTerm: string): Contribution[] => {
  const getContributions = async (): Promise<ContributionsResponse> => {
    const response = await fetch("http://localhost:8000/contributions/");
    if (!response.ok) {
      throw new Error("Unexpected error occurred when fetching contributions");
    }
    return await response.json();
  }
  const {contributions} = use(getContributions())

  return searchTerm ? contributions.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())) : contributions;
}

export default useContributionsData;