import useContributionsData from "@/app/hooks/use-contributions-data";

const ContributionsList = ({ searchTerm }: {
  searchTerm: string
}) => {

  const contributions = useContributionsData(searchTerm)

  return <>
    {/* Display a message if the search term is present but no contributions found */}
    {searchTerm && contributions.length === 0 && (
        <p>No contributions found for &#34;{searchTerm}&#34;.</p>
    )}
    {!searchTerm && contributions.length === 0 && <p>No contributions available.</p>}
    {contributions.map((c) => (
        <div key={c.id}>{JSON.stringify(c)}</div>
    ))}
  </>
}

export default ContributionsList;