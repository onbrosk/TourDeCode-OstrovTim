import { useEffect, useState } from "react";
import { getTeams, type Team } from "../api";

export default function DisplayTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setTeams(await getTeams());
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchTeams();
  }, []);

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p>Error: {error}</p>;
  if (teams.length === 0) return <p>No teams found.</p>;

  return (
    <>
      {teams.map((team) => (
        <h3 key={team.id}>{team.name}</h3>
      ))}
    </>
  );
}
