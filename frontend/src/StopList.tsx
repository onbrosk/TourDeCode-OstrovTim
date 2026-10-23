import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Stop = {
  id: number;
  name: string;
  image_url: string;
};

export default function StopList() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/stops")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load stops");
        return res.json();
      })
      .then(setStops)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (stops.length === 0) return <p>No stops available yet.</p>;

  return (
    <ul>
      {stops.map((stop) => (
        <li key={stop.id}>
          <Link to={`/stops/${stop.id}`}>
            <img src={stop.image_url} alt={stop.name} width={120} />
            <span>{stop.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}