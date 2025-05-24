
import Spinner from "@/app/components/spinner";
import {Suspense} from "react";
import useContributionsData from "@/app/hooks/use-contributions-data";


const ContributionsList = ({ searchTerm }: { searchTerm: string }) => {
  const { contributions } = useContributionsData();
  const filteredContributions = (searchTerm ? contributions.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())) : contributions)

  return <Suspense fallback={<Spinner />} >
    {/* Display a message if the search term is present but no contributions found */}
    {searchTerm && contributions.length === 0 && (
        <p>No contributions found for &#34;{searchTerm}&#34;.</p>
    )}
    {filteredContributions.map((c) => (
        <div key={c.id}>{JSON.stringify(c)}</div>
    ))}
  </Suspense>
}

export default ContributionsList;