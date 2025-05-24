import {Contribution, ContributionsResponse} from "@/app/types";


const getContributions = async (searchTerm: string): Promise<Contribution[]> => {
  const response = await fetch("http://localhost:8000/contributions/");
  if (!response.ok) {
    throw new Error("Unexpected error occurred when fetching contributions");
  }
  const { contributions } = (await response.json() as ContributionsResponse);

  return searchTerm ? contributions.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())) : contributions;
}

export default getContributions;