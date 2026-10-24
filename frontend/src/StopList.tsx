import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StopsShell from "./StopsShell";

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

  if (loading) {
    return (
      <StopsShell>
        <main className="stops-content">
          <div className="stops-status" role="status">
            <span className="stops-spinner" aria-hidden="true" />
            Loading stops...
          </div>
        </main>
      </StopsShell>
    );
  }
  if (error) {
    return (
      <StopsShell>
        <main className="stops-content">
          <div className="stops-status stops-status-error" role="alert">
            <span className="stops-status-icon" aria-hidden="true">!</span>
            <div>
              <h1>We couldn’t load the stops</h1>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </StopsShell>
    );
  }

  const visible = results.slice(0, visibleCount);

  return (
    <StopsShell>
      <main className="stops-content">
        <section className="stops-intro" aria-labelledby="stops-title">
          <p className="stops-eyebrow">
            Think different Academy
          </p>
          <h1 id="stops-title">Find your next stop.</h1>
        </section>

        <section className="stop-search-section" aria-label="Find a stop">
          <div className="stop-search">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stops or facilities"
              aria-label="Search stops by name or facility"
            />
            {query && (
              <button
                className="stop-clear-search"
                type="button"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {stops.length === 0 ? (
          <div className="stops-empty">
            <span className="stops-empty-mark" aria-hidden="true">T</span>
            <h2>No stops available yet</h2>
            <p>New campus stops will appear here when they’re added.</p>
          </div>
        ) : (
          <section className="stop-results" aria-label="Stop results">
            <div className="stop-results-heading">
              <h2>Campus stops</h2>
              <p aria-live="polite">
                <strong>{results.length}</strong> of {stops.length}{" "}
                {stops.length === 1 ? "stop" : "stops"}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="stops-empty stops-empty-search">
                <span className="stops-empty-mark" aria-hidden="true">?</span>
                <h2>No stops match “{query}”</h2>
                <p>Try another name, or clear your search.</p>
                <button
                  className="stop-secondary-button"
                  type="button"
                  onClick={() => setQuery("")}
                >
                  Show all stops
                </button>
              </div>
            ) : (
              <>
                <ul className="stop-grid">
                  {visible.map((stop, index) => {
                    const labels = propertyLabels(stop);
                    return (
                      <li className="stop-card" key={stop.id}>
                        <Link
                          className="stop-card-link"
                          to={`/stops/${stop.id}`}
                          aria-label={`View ${stop.name} stop details`}
                        >
                          <div className="stop-card-image">
                            <img
                              src={stop.image_url}
                              alt=""
                              loading="lazy"
                            />
                            <span className="stop-card-number">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="stop-card-body">
                            <div className="stop-card-title">
                              <h3>{stop.name}</h3>
                              <span className="stop-card-arrow" aria-hidden="true">
                                ↗
                              </span>
                            </div>
                            <p className="stop-card-kicker">Campus stop</p>
                            {labels.length > 0 ? (
                              <ul className="stop-feature-tags" aria-label="Available facilities">
                                {labels.map((label) => (
                                  <li key={label}>{label}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="stop-card-no-features">
                                Facility details unavailable
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {results.length > visibleCount && (
                  <div className="stop-show-more-wrap">
                    <button
                      className="stop-secondary-button"
                      type="button"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    >
                      Show more stops
                      <span aria-hidden="true">↓</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </StopsShell>
  );
}