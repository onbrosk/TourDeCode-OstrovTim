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

  useEffect(() => {
    fetch("/api/v1/stops")
      .then((res) => res.json())
      .then(setStops)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
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