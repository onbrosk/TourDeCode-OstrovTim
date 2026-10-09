import { useEffect, useState } from "react";
import { getMembers, type Member } from "../api";

export default function DisplayMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setMembers(await getMembers());
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
  if (members.length === 0) return <p>No members found.</p>;

  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>
          {member.name} {member.surname}
        </li>
      ))}
    </ul>
  );
}