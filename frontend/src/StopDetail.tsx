import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Stop = {
  id: number;
  name: string;
  image_url: string | null;
  wheelchair_accessible: boolean;
  has_shelter: boolean;
  has_ticket_machine: boolean;
};

export default function StopDetail() {
  const { id } = useParams();
  const [stop, setStop] = useState<Stop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setStop(null);

    fetch(`/api/v1/stops/${encodeURIComponent(id ?? "")}`)
      .then((res) => {
        if (res.status === 404 || res.status === 400) {
          throw new Error("This stop does not exist.");
        }
        if (!res.ok) throw new Error("Could not load the stop. Please try again later.");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStop(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(
          e instanceof TypeError
            ? "The server is not responding. Please try again later."
            : e.message,
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (error || !stop) {
    return (
      <main>
        <p role="alert">{error ?? "Could not load the stop."}</p>
        <Link to="/stops">Back to all stops</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/stops">Back to all stops</Link>
      <h1>{stop.name}</h1>

      {stop.image_url ? (
        <img src={stop.image_url} alt={stop.name} width={400} />
      ) : (
        <p>No image available.</p>
      )}

      <ul>
        <li>Step-free: {stop.wheelchair_accessible ? "Yes" : "No"}</li>
        <li>Shelter: {stop.has_shelter ? "Yes" : "No"}</li>
        <li>Ticket machine: {stop.has_ticket_machine ? "Yes" : "No"}</li>
      </ul>
    </main>
  );
}