
export type Contribution = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  owner: string;
}

export type ContributionsResponse = {
  contributions: Array<Contribution>;
  total: number;
}