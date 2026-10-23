import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Stop = {
  id: number;
  name: string;
  image_url: string;
  wheelchair_accessible: boolean;
  has_shelter: boolean;
  has_ticket_machine: boolean;
};

const PAGE_SIZE = 50;

// lowercase + remove accents, so "cafe" finds "Café"
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function propertyLabels(stop: Stop): string[] {
  const labels: string[] = [];
  if (stop.wheelchair_accessible) labels.push("wheelchair accessible");
  if (stop.has_shelter) labels.push("shelter");
  if (stop.has_ticket_machine) labels.push("ticket machine");
  return labels;
}

export default function StopList() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // keeps typing responsive even with a large list
  const deferredQuery = useDeferredValue(query);

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

  // search text is prepared once per stop, not on every keystroke
  const searchable = useMemo(
    () =>
      stops.map((stop) => ({
        stop,
        name: normalize(stop.name),
        labels: propertyLabels(stop).map(normalize),
      })),
    [stops],
  );

  const results = useMemo(() => {
    const tokens = normalize(deferredQuery).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return stops;
    return searchable
      .filter(({ name, labels }) =>
        tokens.every(
          (token) =>
            name.includes(token) || labels.some((l) => l.includes(token)),
        ),
      )
      .map(({ stop }) => stop);
  }, [searchable, stops, deferredQuery]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredQuery]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (stops.length === 0) return <p>No stops available yet.</p>;

  const visible = results.slice(0, visibleCount);

  return (
    <main>
      <h1>Stops</h1>

      <div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or property (shelter, ticket machine, wheelchair)"
          aria-label="Search stops"
          style={{ width: "100%", maxWidth: 420 }}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")}>
            Clear
          </button>
        )}
      </div>

      <p aria-live="polite">
        {results.length} of {stops.length} stops
      </p>

      {results.length === 0 ? (
        <p>
          No stops match "{query}".{" "}
          <button type="button" onClick={() => setQuery("")}>
            Show all stops
          </button>
        </p>
      ) : (
        <>
          <ul>
            {visible.map((stop) => (
              <li key={stop.id}>
                <Link to={`/stops/${stop.id}`}>
                  <img
                    src={stop.image_url}
                    alt={stop.name}
                    width={120}
                    loading="lazy"
                  />
                  <span>{stop.name}</span>
                </Link>
                <small> {propertyLabels(stop).join(", ")}</small>
              </li>
            ))}
          </ul>
          {results.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Show more
            </button>
          )}
        </>
      )}
    </main>
  );
}