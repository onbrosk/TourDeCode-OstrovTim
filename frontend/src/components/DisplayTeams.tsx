import { useEffect, useState } from "react";
import { getTeams, type Member } from "../api";

export default function DisplayMembers() {
  const [teams, setTeams] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setTeams(await getTeams());
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchMembers();
  }, []);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>Error: {error}</p>;
  if (teams.length === 0) return <p>No members found.</p>;

  return (
    <ul>
      {teams.map((member) => (
        <li key={member.id}>
          {member.name} {member.surname}
        </li>
      ))}
    </ul>
  );
}